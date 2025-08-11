import { NextRequest, NextResponse } from 'next/server';
import { edgeConfigService } from '@/lib/edge-config';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Use default code if not provided
    const otpCode = code || '123456';

    // Create OTP
    const otp = await edgeConfigService.createOTP(email.toLowerCase(), otpCode, 10); // 10 minutes expiry

    return NextResponse.json({
      success: true,
      message: 'OTP created successfully',
      data: {
        id: otp.id,
        email: otp.email,
        code: otp.code,
        expiresAt: otp.expiresAt,
        createdAt: otp.createdAt
      }
    });

  } catch (error) {
    console.error('Create OTP API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
