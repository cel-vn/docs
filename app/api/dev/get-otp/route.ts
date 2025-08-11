import { NextRequest, NextResponse } from 'next/server';
import { fileStorage } from '@/lib/file-storage';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    const otp = fileStorage.getOTPByEmail(email);
    
    if (!otp) {
      return NextResponse.json(
        { success: false, message: 'No valid OTP found for this email' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      otp: otp.code,
      expiresAt: otp.expiresAt
    });
  } catch (error) {
    console.error('Get OTP API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
