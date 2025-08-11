import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get the current token to verify the user
    const token = request.cookies.get('auth-token')?.value;
    
    // Verify token and get user info for logging purposes
    let userInfo = null;
    if (token) {
      try {
        userInfo = verifyToken(token);
        console.log(`User ${userInfo?.email} logged out at ${new Date().toISOString()}`);
      } catch (error) {
        // Token might be invalid, but we'll still clear the cookie
        console.log('Invalid token during logout, clearing cookie anyway');
      }
    }

    const response = NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
    
    // Clear the auth cookie with all necessary attributes
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
      expires: new Date(0), // Set explicit expiry date in the past
    });

    // Add security headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    response.headers.set('Pragma', 'no-cache');
    
    return response;
  } catch (error) {
    console.error('Logout API error:', error);
    
    // Even if there's an error, we should still clear the cookie
    const response = NextResponse.json(
      { success: false, message: 'Logout completed with warnings' },
      { status: 200 } // Return 200 since we want to clear the cookie
    );
    
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
      expires: new Date(0),
    });
    
    return response;
  }
}
