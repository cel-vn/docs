import { NextRequest, NextResponse } from 'next/server';
import { edgeConfigService } from '@/lib/edge-config';

export async function GET(request: NextRequest) {
  try {
    // Get all data from the database
    const [users, otps] = await Promise.all([
      edgeConfigService.getAllUsers(),
      edgeConfigService.getAllOTPs()
    ]);

    // Return basic statistics only for public access
    const stats = {
      timestamp: new Date().toISOString(),
      storageType: process.env.EDGE_CONFIG ? 'Vercel Edge Config' : 'Mock Storage (Development)',
      userStats: {
        total: users.length,
        active: users.filter(u => u.isActive).length,
        inactive: users.filter(u => !u.isActive).length,
        byRole: {
          admin: users.filter(u => u.role === 'admin').length,
          member: users.filter(u => u.role === 'member').length,
          customer: users.filter(u => u.role === 'customer').length,
        }
      },
      otpStats: {
        total: otps.length,
        active: otps.filter(otp => !otp.isUsed && new Date(otp.expiresAt) > new Date()).length,
        used: otps.filter(otp => otp.isUsed).length,
        expired: otps.filter(otp => !otp.isUsed && new Date(otp.expiresAt) <= new Date()).length,
        recent24h: otps.filter(otp => {
          const otpDate = new Date(otp.createdAt);
          const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return otpDate > twentyFourHoursAgo;
        }).length
      },
      note: 'This is a public endpoint showing only statistical data. Personal information is not exposed.'
    };

    return NextResponse.json(stats, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=60', // Cache for 1 minute
      }
    });

  } catch (error) {
    console.error('Public stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', timestamp: new Date().toISOString() },
      { status: 500 }
    );
  }
}
