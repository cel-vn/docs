'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User } from '@/types/auth';

interface AdminDashboardProps {
  user: User;
}

interface UserListItem extends User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member' | 'customer';
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    name: '',
    role: 'member' as 'admin' | 'member' | 'customer'
  });
  const [isCreating, setIsCreating] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data.users);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage('User created successfully');
        setNewUser({ email: '', name: '', role: 'member' });
        setShowCreateForm(false);
        fetchUsers(); // Refresh the user list
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Failed to create user');
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage(data.message);
        fetchUsers(); // Refresh the user list
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage(data.message);
        fetchUsers(); // Refresh the user list
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Failed to delete user');
    }
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

  if (user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-fd-foreground mb-4">Access Denied</h1>
          <p className="text-fd-muted-foreground mb-4">You don't have permission to access this page.</p>
          <Link href="/" className="text-fd-primary hover:text-fd-primary/80">
            Go back to homepage
          </Link>
        </div>
      </div>
    );
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
              <span className="ml-4 text-fd-muted-foreground">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-fd-muted-foreground">
                Welcome, {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-fd-primary hover:text-fd-primary/80"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-fd-foreground">User Management</h1>
          <p className="mt-2 text-fd-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-md ${
            message.includes('success') || message.includes('created') || message.includes('activated') || message.includes('deactivated') || message.includes('deleted')
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Create User Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-4 py-2 bg-fd-primary text-fd-primary-foreground font-medium rounded-lg hover:bg-fd-primary/90"
          >
            {showCreateForm ? 'Cancel' : 'Create New User'}
          </button>
        </div>

        {/* Create User Form */}
        {showCreateForm && (
          <div className="mb-8 bg-fd-card p-6 rounded-lg border border-fd-border">
            <h2 className="text-lg font-semibold text-fd-foreground mb-4">Create New User</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-fd-foreground mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-fd-border rounded-md bg-fd-background text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
                    placeholder="user@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-fd-foreground mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-fd-border rounded-md bg-fd-background text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-fd-foreground mb-1">
                    Role
                  </label>
                  <select
                    id="role"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'member' | 'customer' })}
                    className="w-full px-3 py-2 border border-fd-border rounded-md bg-fd-background text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
                  >
                    <option value="customer">Customer</option>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 bg-fd-primary text-fd-primary-foreground font-medium rounded-md hover:bg-fd-primary/90 disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create User'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-fd-border text-fd-foreground rounded-md hover:bg-fd-muted"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-fd-card rounded-lg border border-fd-border overflow-hidden">
          <div className="px-6 py-4 border-b border-fd-border">
            <h2 className="text-lg font-semibold text-fd-foreground">All Users</h2>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-fd-primary"></div>
              <p className="mt-2 text-fd-muted-foreground">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-fd-muted-foreground">
              No users found.
            </div>
          ) : (
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
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-fd-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-fd-card divide-y divide-fd-border">
                  {users.map((userItem) => (
                    <tr key={userItem.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-fd-foreground">{userItem.name}</div>
                          <div className="text-sm text-fd-muted-foreground">{userItem.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRoleBadgeColor(userItem.role)}`}>
                          {userItem.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${
                          userItem.isActive 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {userItem.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-fd-muted-foreground">
                        {userItem.lastLogin 
                          ? new Date(userItem.lastLogin).toLocaleDateString()
                          : 'Never'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleToggleUserStatus(userItem.id, userItem.isActive)}
                            className={`px-3 py-1 text-xs font-medium rounded ${
                              userItem.isActive
                                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                          >
                            {userItem.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          {userItem.id !== user.id && (
                            <button
                              onClick={() => handleDeleteUser(userItem.id)}
                              className="px-3 py-1 text-xs font-medium rounded bg-red-100 text-red-800 hover:bg-red-200"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
