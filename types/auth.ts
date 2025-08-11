export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // hashed password
  role: 'admin' | 'member' | 'customer';
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface OTP {
  id: string;
  email: string;
  code: string;
  expiresAt: string;
  attempts: number;
  isUsed: boolean;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyOTPRequest {
  email: string;
  code: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  role: 'admin' | 'member' | 'customer';
}
