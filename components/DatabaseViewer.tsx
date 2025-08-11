'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member' | 'customer';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  password: string; // Will be '***HIDDEN***'
}

interface OTP {
  id: string;
  email: string;
  code: string; // Will be '***ACTIVE***' or '***USED***'
  expiresAt: string;
  attempts: number;
  isUsed: boolean;
  createdAt: string;
}

interface DatabaseStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  usersByRole: {
    admin: number;
    member: number;
    customer: number;
  };
  totalOTPs: number;
  activeOTPs: number;
  usedOTPs: number;
  expiredOTPs: number;
}

interface DatabaseData {
  users: User[];
  otps: OTP[];
  stats: DatabaseStats;
  storageType: string;
  lastUpdated: string;
}

export default function DatabaseViewer() {
  const [data, setData] = useState<DatabaseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'otps'>('overview');

  useEffect(() => {
    fetchDatabaseData();
  }, []);

  const fetchDatabaseData = async () => {
    try {
      const response = await fetch('/api/admin/database');
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch database data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'member':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'customer':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fd-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fd-primary mx-auto"></div>
          <p className="mt-4 text-fd-muted-foreground">Loading database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fd-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-fd-muted-foreground mb-4">{error}</p>
          <Link href="/admin/dashboard" className="text-fd-primary hover:text-fd-primary/80">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-fd-background">
      {/* Header */}
      <header className="bg-fd-card border-b border-fd-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-fd-primary">
                CEL Developer
              </Link>
              <span className="ml-4 text-fd-muted-foreground">Database Viewer</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchDatabaseData}
                className="text-sm text-fd-primary hover:text-fd-primary/80"
              >
                Refresh
              </button>
              <Link
                href="/admin/dashboard"
                className="text-sm text-fd-primary hover:text-fd-primary/80"
              >
                ← Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-fd-foreground">Database Contents</h1>
          <p className="mt-2 text-fd-muted-foreground">
            Storage Type: <span className="font-medium">{data.storageType}</span> | 
            Last Updated: <span className="font-medium">{formatDate(data.lastUpdated)}</span>
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-fd-border mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'users', label: `Users (${data.users.length})` },
              { key: 'otps', label: `Recent OTPs (${data.otps.length})` }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-fd-primary text-fd-primary'
                    : 'border-transparent text-fd-muted-foreground hover:text-fd-foreground hover:border-fd-border'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Stats */}
            <div className="bg-fd-card p-6 rounded-lg border border-fd-border">
              <h3 className="text-lg font-semibold text-fd-foreground mb-4">User Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-fd-muted-foreground">Total Users:</span>
                  <span className="font-medium text-fd-foreground">{data.stats.totalUsers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fd-muted-foreground">Active:</span>
                  <span className="font-medium text-green-600">{data.stats.activeUsers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fd-muted-foreground">Inactive:</span>
                  <span className="font-medium text-red-600">{data.stats.inactiveUsers}</span>
                </div>
              </div>
            </div>

            {/* Role Distribution */}
            <div className="bg-fd-card p-6 rounded-lg border border-fd-border">
              <h3 className="text-lg font-semibold text-fd-foreground mb-4">Users by Role</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-fd-muted-foreground">Admins:</span>
                  <span className="font-medium text-red-600">{data.stats.usersByRole.admin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fd-muted-foreground">Members:</span>
                  <span className="font-medium text-blue-600">{data.stats.usersByRole.member}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fd-muted-foreground">Customers:</span>
                  <span className="font-medium text-green-600">{data.stats.usersByRole.customer}</span>
                </div>
              </div>
            </div>

            {/* OTP Stats */}
            <div className="bg-fd-card p-6 rounded-lg border border-fd-border">
              <h3 className="text-lg font-semibold text-fd-foreground mb-4">OTP Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-fd-muted-foreground">Total OTPs:</span>
                  <span className="font-medium text-fd-foreground">{data.stats.totalOTPs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fd-muted-foreground">Active:</span>
                  <span className="font-medium text-green-600">{data.stats.activeOTPs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fd-muted-foreground">Used:</span>
                  <span className="font-medium text-blue-600">{data.stats.usedOTPs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fd-muted-foreground">Expired:</span>
                  <span className="font-medium text-red-600">{data.stats.expiredOTPs}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-fd-card rounded-lg border border-fd-border overflow-hidden">
            <div className="px-6 py-4 border-b border-fd-border">
              <h2 className="text-lg font-semibold text-fd-foreground">All Users</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-fd-border">
                <thead className="bg-fd-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-fd-muted-foreground uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-fd-muted-foreground uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-fd-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-fd-muted-foreground uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-fd-muted-foreground uppercase tracking-wider">
                      Last Login
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-fd-card divide-y divide-fd-border">
                  {data.users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-fd-foreground">{user.name}</div>
                          <div className="text-sm text-fd-muted-foreground">{user.email}</div>
                          <div className="text-xs text-fd-muted-foreground">ID: {user.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                          user.isActive 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-fd-muted-foreground">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-fd-muted-foreground">
                        {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'otps' && (
          <div className="bg-fd-card rounded-lg border border-fd-border overflow-hidden">
            <div className="px-6 py-4 border-b border-fd-border">
              <h2 className="text-lg font-semibold text-fd-foreground">Recent OTPs (Last 24 Hours)</h2>
            </div>
            
            {data.otps.length === 0 ? (
              <div className="p-8 text-center text-fd-muted-foreground">
                No OTPs generated in the last 24 hours.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-fd-border">
                  <thead className="bg-fd-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-fd-muted-foreground uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-fd-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-fd-muted-foreground uppercase tracking-wider">
                        Attempts
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-fd-muted-foreground uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-fd-muted-foreground uppercase tracking-wider">
                        Expires
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-fd-card divide-y divide-fd-border">
                    {data.otps.map((otp) => (
                      <tr key={otp.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-fd-foreground">{otp.email}</div>
                          <div className="text-xs text-fd-muted-foreground">ID: {otp.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                            otp.isUsed 
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : new Date(otp.expiresAt) > new Date()
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : 'bg-red-100 text-red-800 border-red-200'
                          }`}>
                            {otp.isUsed ? 'Used' : new Date(otp.expiresAt) > new Date() ? 'Active' : 'Expired'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-fd-foreground">
                          {otp.attempts}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-fd-muted-foreground">
                          {formatDate(otp.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-fd-muted-foreground">
                          {formatDate(otp.expiresAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
