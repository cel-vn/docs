'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/admin/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        setMessage(data.message);
        // Redirect to verify page with email
        router.push(`/verify?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirectTo)}`);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-fd-background px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link href="/" className="flex justify-center">
            <h1 className="text-3xl font-bold text-fd-primary">CEL Developer</h1>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-fd-foreground">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-fd-muted-foreground">
            Enter your email and password to receive a verification code
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-fd-card p-6 rounded-lg border border-fd-border shadow-sm">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-fd-foreground mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-fd-border placeholder-fd-muted-foreground text-fd-foreground bg-fd-background rounded-md focus:outline-none focus:ring-fd-primary focus:border-fd-primary focus:z-10 sm:text-sm"
                  placeholder="Enter your email address"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-fd-foreground mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-2 border border-fd-border placeholder-fd-muted-foreground text-fd-foreground bg-fd-background rounded-md focus:outline-none focus:ring-fd-primary focus:border-fd-primary focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>
            </div>

            {message && (
              <div className={`mt-4 p-3 rounded-md ${
                isSuccess 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading || !email || !password}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-fd-primary-foreground bg-fd-primary hover:bg-fd-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fd-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-fd-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {isLoading ? 'Signing in...' : 'Sign in & Send OTP'}
              </button>
            </div>
          </div>
        </form>

        <div className="text-center">
          <Link 
            href="/" 
            className="text-fd-primary hover:text-fd-primary/80 text-sm font-medium"
          >
            ← Back to homepage
          </Link>
        </div>

        <div className="mt-8 bg-fd-muted/50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-fd-foreground mb-2">Demo Accounts:</h3>
          <div className="text-xs text-fd-muted-foreground space-y-2">
            <div>
              <p><strong>Admin:</strong> binazure@gmail.com</p>
              <p className="ml-4">Password: admin123</p>
            </div>
            <div>
              <p><strong>Member:</strong> member@celdeveloper.com</p>
              <p className="ml-4">Password: member123</p>
            </div>
            <div>
              <p><strong>Customer:</strong> customer@celdeveloper.com</p>
              <p className="ml-4">Password: customer123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
