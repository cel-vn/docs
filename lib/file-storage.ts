import { User, OTP } from '@/types/auth';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

// File-based storage for development
const STORAGE_DIR = join(process.cwd(), '.storage');
const USERS_FILE = join(STORAGE_DIR, 'users.json');
const OTPS_FILE = join(STORAGE_DIR, 'otps.json');

// Ensure storage directory exists
import { mkdirSync } from 'fs';
if (!existsSync(STORAGE_DIR)) {
  mkdirSync(STORAGE_DIR, { recursive: true });
}

class FileStorage {
  private readUsers(): User[] {
    try {
      if (existsSync(USERS_FILE)) {
        const data = readFileSync(USERS_FILE, 'utf-8');
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error('Error reading users file:', error);
      return [];
    }
  }

  private writeUsers(users: User[]): void {
    try {
      writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    } catch (error) {
      console.error('Error writing users file:', error);
    }
  }

  private readOTPs(): OTP[] {
    try {
      if (existsSync(OTPS_FILE)) {
        const data = readFileSync(OTPS_FILE, 'utf-8');
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error('Error reading OTPs file:', error);
      return [];
    }
  }

  private writeOTPs(otps: OTP[]): void {
    try {
      writeFileSync(OTPS_FILE, JSON.stringify(otps, null, 2));
    } catch (error) {
      console.error('Error writing OTPs file:', error);
    }
  }

  // User methods
  getAllUsers(): User[] {
    return this.readUsers();
  }

  getUserByEmail(email: string): User | null {
    const users = this.readUsers();
    return users.find(user => user.email === email) || null;
  }

  getUserById(id: string): User | null {
    const users = this.readUsers();
    return users.find(user => user.id === id) || null;
  }

  createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
    const users = this.readUsers();
    const newUser: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    this.writeUsers(users);
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const users = this.readUsers();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return null;
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    this.writeUsers(users);
    return users[userIndex];
  }

  deleteUser(id: string): boolean {
    const users = this.readUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    
    if (filteredUsers.length === users.length) {
      return false; // User not found
    }

    this.writeUsers(filteredUsers);
    return true;
  }

  // OTP methods
  getAllOTPs(): OTP[] {
    return this.readOTPs();
  }

  getOTPByEmail(email: string): OTP | null {
    const otps = this.readOTPs();
    const validOTPs = otps.filter(otp => 
      otp.email === email && 
      !otp.isUsed && 
      new Date(otp.expiresAt) > new Date()
    );
    
    // Return the most recent valid OTP
    return validOTPs.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0] || null;
  }

  createOTP(email: string, code: string, expiryMinutes: number = 5): OTP {
    const otps = this.readOTPs();
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

    cleanedOTPs.push(newOTP);
    this.writeOTPs(cleanedOTPs);
    return newOTP;
  }

  markOTPAsUsed(id: string): boolean {
    const otps = this.readOTPs();
    const otpIndex = otps.findIndex(otp => otp.id === id);
    
    if (otpIndex === -1) {
      return false;
    }

    otps[otpIndex].isUsed = true;
    this.writeOTPs(otps);
    return true;
  }

  incrementOTPAttempts(id: string): boolean {
    const otps = this.readOTPs();
    const otpIndex = otps.findIndex(otp => otp.id === id);
    
    if (otpIndex === -1) {
      return false;
    }

    otps[otpIndex].attempts += 1;
    this.writeOTPs(otps);
    return true;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Initialize default users if no users exist
  async initializeDefaultUsers(): Promise<void> {
    const users = this.getAllUsers();
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
        this.createUser(userData);
      }
      
      console.log('Default users created in file storage');
    }
  }
}

export const fileStorage = new FileStorage();
