'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifyPage() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      router.push('/login');
    }
  }, [searchParams, router]);

  const redirectTo = searchParams.get('redirect') || '/admin/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        // Redirect to dashboard or intended page
        setTimeout(() => {
          router.push(redirectTo);
        }, 1000);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fd-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fd-primary mx-auto"></div>
          <p className="mt-4 text-fd-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-fd-background px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link href="/" className="flex justify-center">
            <h1 className="text-3xl font-bold text-fd-primary">CEL Developer</h1>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-fd-foreground">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-fd-muted-foreground">
            We sent a verification code to <strong>{email}</strong>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-fd-card p-6 rounded-lg border border-fd-border shadow-sm">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-fd-foreground mb-2">
                Verification code
              </label>
              <input
                id="code"
                name="code"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="appearance-none relative block w-full px-3 py-2 border border-fd-border placeholder-fd-muted-foreground text-fd-foreground bg-fd-background rounded-md focus:outline-none focus:ring-fd-primary focus:border-fd-primary focus:z-10 sm:text-sm text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-fd-muted-foreground">
                Enter the 6-digit code from your email
              </p>
            </div>

            {message && (
              <div className={`mt-4 p-3 rounded-md ${
                message.includes('successful') || message.includes('sent')
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            <div className="mt-6 space-y-3">
              <button
                type="submit"
                disabled={isLoading || code.length !== 6}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-fd-primary-foreground bg-fd-primary hover:bg-fd-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fd-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-fd-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {isLoading ? 'Verifying...' : 'Verify and sign in'}
              </button>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={isLoading}
                className="w-full text-center text-sm text-fd-primary hover:text-fd-primary/80 disabled:opacity-50"
              >
                Didn't receive the code? Resend
              </button>
            </div>
          </div>
        </form>

        <div className="text-center space-y-2">
          <Link 
            href="/login" 
            className="block text-fd-primary hover:text-fd-primary/80 text-sm font-medium"
          >
            ← Use different email
          </Link>
          <Link 
            href="/" 
            className="block text-fd-muted-foreground hover:text-fd-foreground text-sm"
          >
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
