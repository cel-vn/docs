import { User, OTP } from '@/types/auth';

// Mock storage for fallback
const mockStorage = new Map<string, any>();

class EdgeConfigService {
  private readonly USERS_KEY = 'users';
  private readonly OTPS_KEY = 'otps';

  // User methods
  async getAllUsers(): Promise<User[]> {
    try {
      if (process.env.EDGE_CONFIG) {
        // Use actual Edge Config when available
        const { get } = await import('@vercel/edge-config');
        const users = await get<User[]>(this.USERS_KEY);
        return users || [];
      } else {
        // Use file storage as fallback in development
        const { fileStorage } = await import('./file-storage');
        return fileStorage.getAllUsers();
      }
    } catch (error) {
      console.error('Error getting users:', error);
      // Fallback to file storage on error
      try {
        const { fileStorage } = await import('./file-storage');
        return fileStorage.getAllUsers();
      } catch (fallbackError) {
        console.error('File storage fallback error:', fallbackError);
        return mockStorage.get(this.USERS_KEY) || [];
      }
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      if (process.env.EDGE_CONFIG) {
        const users = await this.getAllUsers();
        return users.find(user => user.email === email) || null;
      } else {
        const { fileStorage } = await import('./file-storage');
        return fileStorage.getUserByEmail(email);
      }
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      if (process.env.EDGE_CONFIG) {
        const users = await this.getAllUsers();
        return users.find(user => user.id === id) || null;
      } else {
        const { fileStorage } = await import('./file-storage');
        return fileStorage.getUserById(id);
      }
    } catch (error) {
      console.error('Error getting user by id:', error);
      return null;
    }
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    try {
      if (process.env.EDGE_CONFIG) {
        const users = await this.getAllUsers();
        const newUser: User = {
          ...userData,
          id: this.generateId(),
          createdAt: new Date().toISOString(),
        };
        
        const updatedUsers = [...users, newUser];
        await this.updateUsers(updatedUsers);
        return newUser;
      } else {
        const { fileStorage } = await import('./file-storage');
        return fileStorage.createUser(userData);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      if (process.env.EDGE_CONFIG) {
        const users = await this.getAllUsers();
        const userIndex = users.findIndex(user => user.id === id);
        
        if (userIndex === -1) {
          return null;
        }

        users[userIndex] = { ...users[userIndex], ...updates };
        await this.updateUsers(users);
        return users[userIndex];
      } else {
        const { fileStorage } = await import('./file-storage');
        return fileStorage.updateUser(id, updates);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      if (process.env.EDGE_CONFIG) {
        const users = await this.getAllUsers();
        const filteredUsers = users.filter(user => user.id !== id);
        
        if (filteredUsers.length === users.length) {
          return false; // User not found
        }

        await this.updateUsers(filteredUsers);
        return true;
      } else {
        const { fileStorage } = await import('./file-storage');
        return fileStorage.deleteUser(id);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }

  // OTP methods
  async getAllOTPs(): Promise<OTP[]> {
    try {
      if (process.env.EDGE_CONFIG) {
        // Use actual Edge Config when available
        const { get } = await import('@vercel/edge-config');
        const otps = await get<OTP[]>(this.OTPS_KEY);
        return otps || [];
      } else {
        // Use file storage as fallback
        const { fileStorage } = await import('./file-storage');
        return fileStorage.getAllOTPs();
      }
    } catch (error) {
      console.error('Error getting OTPs:', error);
      // Fallback to file storage
      try {
        const { fileStorage } = await import('./file-storage');
        return fileStorage.getAllOTPs();
      } catch (fallbackError) {
        console.error('File storage fallback error:', fallbackError);
        return mockStorage.get(this.OTPS_KEY) || [];
      }
    }
  }

  async getOTPByEmail(email: string): Promise<OTP | null> {
    try {
      if (process.env.EDGE_CONFIG) {
        const otps = await this.getAllOTPs();
        const validOTPs = otps.filter(otp => 
          otp.email === email && 
          !otp.isUsed && 
          new Date(otp.expiresAt) > new Date()
        );
        
        // Return the most recent valid OTP
        return validOTPs.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0] || null;
      } else {
        const { fileStorage } = await import('./file-storage');
        return fileStorage.getOTPByEmail(email);
      }
    } catch (error) {
      console.error('Error getting OTP by email:', error);
      return null;
    }
  }

  async createOTP(email: string, code: string, expiryMinutes: number = 5): Promise<OTP> {
    try {
      if (process.env.EDGE_CONFIG) {
        const otps = await this.getAllOTPs();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + expiryMinutes);

        const newOTP: OTP = {
          id: this.generateId(),
          email,
          code,
          expiresAt: expiresAt.toISOString(),
          attempts: 0,
          isUsed: false,
          createdAt: new Date().toISOString(),
        };

        // Clean up old OTPs for this email
        const cleanedOTPs = otps.filter(otp => 
          otp.email !== email || 
          (new Date(otp.expiresAt) > new Date() && !otp.isUsed)
        );

        const updatedOTPs = [...cleanedOTPs, newOTP];
        await this.updateOTPs(updatedOTPs);
        return newOTP;
      } else {
        const { fileStorage } = await import('./file-storage');
        return fileStorage.createOTP(email, code, expiryMinutes);
      }
    } catch (error) {
      console.error('Error creating OTP:', error);
      throw new Error('Failed to create OTP');
    }
  }

  async markOTPAsUsed(id: string): Promise<boolean> {
    try {
      if (process.env.EDGE_CONFIG) {
        const otps = await this.getAllOTPs();
        const otpIndex = otps.findIndex(otp => otp.id === id);
        
        if (otpIndex === -1) {
          return false;
        }

        otps[otpIndex].isUsed = true;
        await this.updateOTPs(otps);
        return true;
      } else {
        const { fileStorage } = await import('./file-storage');
        return fileStorage.markOTPAsUsed(id);
      }
    } catch (error) {
      console.error('Error marking OTP as used:', error);
      return false;
    }
  }

  async incrementOTPAttempts(id: string): Promise<boolean> {
    try {
      if (process.env.EDGE_CONFIG) {
        const otps = await this.getAllOTPs();
        const otpIndex = otps.findIndex(otp => otp.id === id);
        
        if (otpIndex === -1) {
          return false;
        }

        otps[otpIndex].attempts += 1;
        await this.updateOTPs(otps);
        return true;
      } else {
        const { fileStorage } = await import('./file-storage');
        return fileStorage.incrementOTPAttempts(id);
      }
    } catch (error) {
      console.error('Error incrementing OTP attempts:', error);
      return false;
    }
  }

  // Helper methods
  private async updateUsers(users: User[]): Promise<void> {
    // For now, we'll use mock storage since Edge Config is read-only at runtime
    // In production with proper Vercel API setup, you would update via API
    mockStorage.set(this.USERS_KEY, users);
    console.log('Users updated in storage:', users.length, 'users');
  }

  private async updateOTPs(otps: OTP[]): Promise<void> {
    // For now, we'll use mock storage since Edge Config is read-only at runtime
    // In production with proper Vercel API setup, you would update via API
    mockStorage.set(this.OTPS_KEY, otps);
    console.log('OTPs updated in storage:', otps.length, 'OTPs');
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Initialize default users if no users exist
  async initializeDefaultUsers(): Promise<void> {
    try {
      if (process.env.EDGE_CONFIG) {
        const users = await this.getAllUsers();
        if (users.length === 0) {
          // Import bcrypt dynamically to avoid issues
          const bcrypt = await import('bcryptjs');
          
          const defaultUsers = [
            {
              email: 'binazure@gmail.com',
              name: 'System Administrator',
              password: await bcrypt.hash('admin123', 12),
              role: 'admin' as const,
              isActive: true,
            },
            {
              email: 'member@celdeveloper.com',
              name: 'Team Member',
              password: await bcrypt.hash('member123', 12),
              role: 'member' as const,
              isActive: true,
            },
            {
              email: 'customer@celdeveloper.com',
              name: 'Customer User',
              password: await bcrypt.hash('customer123', 12),
              role: 'customer' as const,
              isActive: true,
            },
            {
              email: 'truongnh2299@gmail.com',
              name: 'Truong Nguyen',
              password: await bcrypt.hash('password123', 12),
              role: 'member' as const,
              isActive: true,
            }
          ];

          for (const userData of defaultUsers) {
            await this.createUser(userData);
          }
          
          console.log('Default users created');
        }
      } else {
        // Use file storage for initialization
        const { fileStorage } = await import('./file-storage');
        await fileStorage.initializeDefaultUsers();
      }
    } catch (error) {
      console.error('Error initializing default users:', error);
    }
  }
}

export const edgeConfigService = new EdgeConfigService();
