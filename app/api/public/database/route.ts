import { NextRequest, NextResponse } from 'next/server';
import { edgeConfigService } from '@/lib/edge-config';

export async function GET(request: NextRequest) {
  try {
    // Get all data from the database
    const [users, otps] = await Promise.all([
      edgeConfigService.getAllUsers(),
      edgeConfigService.getAllOTPs()
    ]);

    // Remove sensitive data from users (passwords and personal details)
    const publicUsers = users.map(user => ({
      id: user.id,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      // Mask email for privacy
      email: user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
      // Remove name and password for privacy
    }));

    // Filter and sanitize OTPs (last 24 hours only, remove sensitive data)
    const recentOTPs = otps
      .filter(otp => {
        const otpDate = new Date(otp.createdAt);
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return otpDate > twentyFourHoursAgo;
      })
      .map(otp => ({
        id: otp.id,
        // Mask email for privacy
        email: otp.email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
        status: otp.isUsed ? 'used' : new Date(otp.expiresAt) > new Date() ? 'active' : 'expired',
        attempts: otp.attempts,
        createdAt: otp.createdAt,
        expiresAt: otp.expiresAt,
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
      recentOTPs: recentOTPs.length,
    };

    return NextResponse.json({
      success: true,
      data: {
        users: publicUsers,
        otps: recentOTPs,
        stats: databaseStats,
        storageType: process.env.EDGE_CONFIG ? 'Vercel Edge Config' : 'Mock Storage (Development)',
        lastUpdated: new Date().toISOString(),
        note: 'Personal information has been masked for privacy protection'
      }
    });

  } catch (error) {
    console.error('Public database view API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
