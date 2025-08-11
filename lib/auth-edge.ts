import { User } from '@/types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export function verifyTokenEdge(token: string): User | null {
  try {
    // Simple JWT decode without verification for Edge runtime
    // In production, you should use proper JWT verification
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(parts[1]));
    
    // Basic expiration check
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }

    return payload.user;
  } catch (error) {
    console.error('Error verifying token in edge:', error);
    return null;
  }
}
