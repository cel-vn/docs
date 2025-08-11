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
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = verifyToken(token);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get all data from the database
    const [users, otps] = await Promise.all([
      edgeConfigService.getAllUsers(),
      edgeConfigService.getAllOTPs()
    ]);

    // Remove sensitive data from users (passwords)
    const sanitizedUsers = users.map(user => ({
      ...user,
      password: '***HIDDEN***'
    }));

    // Filter recent OTPs (last 24 hours) and remove sensitive codes
    const recentOTPs = otps
      .filter(otp => {
        const otpDate = new Date(otp.createdAt);
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return otpDate > twentyFourHoursAgo;
      })
      .map(otp => ({
        ...otp,
        code: otp.isUsed ? '***USED***' : '***ACTIVE***'
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const databaseStats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.isActive).length,
      inactiveUsers: users.filter(u => !u.isActive).length,
      usersByRole: {
        admin: users.filter(u => u.role === 'admin').length,
        member: users.filter(u => u.role === 'member').length,
        customer: users.filter(u => u.role === 'customer').length,
      },
      totalOTPs: otps.length,
      activeOTPs: otps.filter(otp => !otp.isUsed && new Date(otp.expiresAt) > new Date()).length,
      usedOTPs: otps.filter(otp => otp.isUsed).length,
      expiredOTPs: otps.filter(otp => !otp.isUsed && new Date(otp.expiresAt) <= new Date()).length,
    };

    return NextResponse.json({
      success: true,
      data: {
        users: sanitizedUsers,
        otps: recentOTPs,
        stats: databaseStats,
        storageType: process.env.EDGE_CONFIG ? 'Vercel Edge Config' : 'Mock Storage (Development)',
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Database view API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
