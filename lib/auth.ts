import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, OTP, AuthResponse } from '@/types/auth';
import { edgeConfigService } from './edge-config';
import { emailService } from './email';

class AuthService {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
  private readonly OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES || '5');

  async requestOTP(email: string, password: string): Promise<AuthResponse> {
    try {
      // Check if user exists
      const user = await edgeConfigService.getUserByEmail(email);
      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password.',
        };
      }

      if (!user.isActive) {
        return {
          success: false,
          message: 'Your account is deactivated. Please contact an administrator.',
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid email or password.',
        };
      }

      // Generate OTP
      const code = this.generateOTP();
      
      // Save OTP to database
      await edgeConfigService.createOTP(email, code, this.OTP_EXPIRY_MINUTES);
      
      // Send OTP via email
      const emailSent = await emailService.sendOTP(email, code, user.name);
      
      if (!emailSent) {
        return {
          success: false,
          message: 'Failed to send verification code. Please try again.',
        };
      }

      return {
        success: true,
        message: 'Verification code sent to your email address.',
      };
    } catch (error) {
      console.error('Error requesting OTP:', error);
      return {
        success: false,
        message: 'An error occurred. Please try again.',
      };
    }
  }

  async verifyOTP(email: string, code: string): Promise<AuthResponse> {
    try {
      // Get user
      const user = await edgeConfigService.getUserByEmail(email);
      if (!user) {
        return {
          success: false,
          message: 'User not found.',
        };
      }

      // Get OTP
      const otp = await edgeConfigService.getOTPByEmail(email);
      if (!otp) {
        return {
          success: false,
          message: 'Invalid or expired verification code.',
        };
      }

      // Check if OTP is expired
      if (new Date() > new Date(otp.expiresAt)) {
        return {
          success: false,
          message: 'Verification code has expired. Please request a new one.',
        };
      }

      // Check if too many attempts
      if (otp.attempts >= 3) {
        return {
          success: false,
          message: 'Too many failed attempts. Please request a new verification code.',
        };
      }

      // Verify code
      if (otp.code !== code) {
        await edgeConfigService.incrementOTPAttempts(otp.id);
        return {
          success: false,
          message: 'Invalid verification code.',
        };
      }

      // Mark OTP as used
      await edgeConfigService.markOTPAsUsed(otp.id);

      // Update user's last login
      await edgeConfigService.updateUser(user.id, {
        lastLogin: new Date().toISOString(),
      });

      // Generate JWT token
      const token = this.generateToken(user);

      return {
        success: true,
        message: 'Login successful.',
        token,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
      };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: 'An error occurred. Please try again.',
      };
    }
  }

  async createUser(userData: {
    email: string;
    name: string;
    role: 'admin' | 'member' | 'customer';
    password?: string;
  }, createdBy: User): Promise<AuthResponse> {
    try {
      // Check if creator is admin
      if (createdBy.role !== 'admin') {
        return {
          success: false,
          message: 'Only administrators can create new users.',
        };
      }

      // Check if user already exists
      const existingUser = await edgeConfigService.getUserByEmail(userData.email);
      if (existingUser) {
        return {
          success: false,
          message: 'User with this email already exists.',
        };
      }

      // Generate default password if not provided
      const defaultPassword = userData.password || this.generateDefaultPassword();
      const hashedPassword = await bcrypt.hash(defaultPassword, 12);

      // Create new user
      const newUser = await edgeConfigService.createUser({
        ...userData,
        password: hashedPassword,
        isActive: true,
      });

      // Send welcome email with password
      await emailService.sendWelcomeEmail(newUser.email, newUser.name, newUser.role, defaultPassword);

      return {
        success: true,
        message: 'User created successfully.',
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
          },
        },
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        message: 'Failed to create user. Please try again.',
      };
    }
  }

  private generateDefaultPassword(): string {
    return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
  }

  async getAllUsers(requestingUser: User): Promise<AuthResponse> {
    try {
      // Check if user is admin
      if (requestingUser.role !== 'admin') {
        return {
          success: false,
          message: 'Only administrators can view all users.',
        };
      }

      const users = await edgeConfigService.getAllUsers();
      
      return {
        success: true,
        message: 'Users retrieved successfully.',
        data: {
          users: users.map(user => ({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
            isActive: user.isActive,
          })),
        },
      };
    } catch (error) {
      console.error('Error getting users:', error);
      return {
        success: false,
        message: 'Failed to retrieve users.',
      };
    }
  }

  async updateUserStatus(userId: string, isActive: boolean, requestingUser: User): Promise<AuthResponse> {
    try {
      // Check if user is admin
      if (requestingUser.role !== 'admin') {
        return {
          success: false,
          message: 'Only administrators can update user status.',
        };
      }

      const updatedUser = await edgeConfigService.updateUser(userId, { isActive });
      
      if (!updatedUser) {
        return {
          success: false,
          message: 'User not found.',
        };
      }

      return {
        success: true,
        message: `User ${isActive ? 'activated' : 'deactivated'} successfully.`,
        data: { user: updatedUser },
      };
    } catch (error) {
      console.error('Error updating user status:', error);
      return {
        success: false,
        message: 'Failed to update user status.',
      };
    }
  }

  verifyToken(token: string): User | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as any;
      return decoded.user;
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }

  private generateToken(user: User): string {
    return jwt.sign(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      this.JWT_SECRET,
      { expiresIn: '7d' } // Token expires in 7 days
    );
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

export const authService = new AuthService();

// Export individual functions for convenience
export const verifyToken = (token: string): User | null => {
  return authService.verifyToken(token);
};
