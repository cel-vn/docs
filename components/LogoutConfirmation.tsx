'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LogoutConfirmation() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      const data = await response.json();

      if (data.success) {
        setMessage('You have been successfully logged out.');
        
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/');
          window.location.reload(); // Force refresh to clear any cached state
        }, 2000);
      } else {
        throw new Error(data.message || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      setMessage('An error occurred during logout. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleCancel = () => {
    router.back(); // Go back to the previous page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-fd-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-fd-foreground">
            Confirm Logout
          </h2>
          <p className="mt-2 text-sm text-fd-muted-foreground">
            Are you sure you want to log out of your account?
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-md text-center ${
            message.includes('successfully') 
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging out...
              </>
            ) : (
              'Yes, Log me out'
            )}
          </button>

          <button
            onClick={handleCancel}
            disabled={isLoggingOut}
            className="w-full flex justify-center py-2 px-4 border border-fd-border text-sm font-medium rounded-md text-fd-foreground bg-fd-background hover:bg-fd-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fd-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>

        <div className="text-center">
          <Link 
            href="/"
            className="text-sm text-fd-primary hover:text-fd-primary/80"
          >
            Return to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
