'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member' | 'customer';
}

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
      const data = await response.json();
      
      if (data.success && data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (!confirmed) {
      return;
    }

    setIsLoggingOut(true);
    
    try {
      const response = await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Clear user state
        setUser(null);
        
        // Show success message briefly
        alert('You have been logged out successfully.');
        
        // Redirect to home page
        router.push('/');
        
        // Force page refresh to ensure clean state
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        throw new Error(data.message || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-8 h-8 animate-pulse bg-fd-muted rounded-md"></div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center space-x-3">
        <div className="hidden sm:block text-sm text-fd-muted-foreground">
          Welcome, <span className="font-medium text-fd-foreground">{user.name}</span>
        </div>
        {user.role === 'admin' && (
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-fd-border bg-fd-background hover:bg-fd-muted hover:text-fd-foreground h-9 px-3"
          >
            Admin
          </Link>
        )}
        
        {/* User Profile Dropdown */}
        <div className="relative group">
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-fd-border bg-fd-background hover:bg-fd-muted hover:text-fd-foreground h-9 px-3">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-fd-card border border-fd-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="py-1">
              <div className="px-4 py-2 text-xs text-fd-muted-foreground border-b border-fd-border">
                {user.email}
              </div>
              <Link
                href="/logout"
                className="block px-4 py-2 text-sm text-fd-foreground hover:bg-fd-muted"
              >
                Logout (with confirmation)
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {isLoggingOut ? 'Logging out...' : 'Quick Logout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link 
      href="/login"
      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
    >
      Login
    </Link>
  );
}
