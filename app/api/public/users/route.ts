import { NextRequest, NextResponse } from 'next/server';
import { edgeConfigService } from '@/lib/edge-config';

export async function POST(request: NextRequest) {
  try {
    const { email, name, password, role } = await request.json();

    if (!email || !name || !password || !role) {
      return NextResponse.json(
        { success: false, message: 'Email, name, password, and role are required' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['admin', 'member', 'customer'].includes(role)) {
      return NextResponse.json(
        { success: false, message: 'Role must be admin, member, or customer' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await edgeConfigService.getUserByEmail(email.toLowerCase());
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const newUser = await edgeConfigService.createUser({
      email: email.toLowerCase(),
      name,
      password: hashedPassword,
      role,
      isActive: true,
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      data: { user: userWithoutPassword }
    });

  } catch (error) {
    console.error('Create user API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get all users (without passwords)
    const users = await edgeConfigService.getAllUsers();
    const sanitizedUsers = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return NextResponse.json({
      success: true,
      data: { users: sanitizedUsers, count: users.length }
    });

  } catch (error) {
    console.error('Get users API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
