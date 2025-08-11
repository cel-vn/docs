import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { edgeConfigService } from '@/lib/edge-config';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = verifyToken(token);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get all data from the database
    const [users, otps] = await Promise.all([
      edgeConfigService.getAllUsers(),
      edgeConfigService.getAllOTPs()
    ]);

    // For security, don't expose passwords or OTP codes
    const sanitizedUsers = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    const sanitizedOTPs = otps.map(otp => {
      const { code, ...otpWithoutCode } = otp;
      return {
        ...otpWithoutCode,
        codeLength: code.length,
        codeHash: `${code.substring(0, 2)}****`
      };
    });

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      storageType: process.env.EDGE_CONFIG ? 'Vercel Edge Config' : 'Mock Storage (Development)',
      users: sanitizedUsers,
      otps: sanitizedOTPs,
      stats: {
        totalUsers: users.length,
        totalOTPs: otps.length,
        activeUsers: users.filter(u => u.isActive).length,
        activeOTPs: otps.filter(otp => !otp.isUsed && new Date(otp.expiresAt) > new Date()).length
      }
    }, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      }
    });

  } catch (error) {
    console.error('Database JSON API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
