import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { fileStorage } from '@/lib/file-storage';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    const user = verifyToken(token);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const users = fileStorage.getAllUsers();
    
    return NextResponse.json({
      success: true,
      data: {
        users: users.map(u => ({
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role,
          isActive: u.isActive,
          createdAt: u.createdAt,
          lastLogin: u.lastLogin
        }))
      }
    });
  } catch (error) {
    console.error('Get users API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    const user = verifyToken(token);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { email, name, role } = await request.json();

    if (!email || !name || !role) {
      return NextResponse.json(
        { success: false, message: 'Email, name, and role are required' },
        { status: 400 }
      );
    }

    if (!['admin', 'member', 'customer'].includes(role)) {
      return NextResponse.json(
        { success: false, message: 'Invalid role' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = fileStorage.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Import bcrypt dynamically
    const bcrypt = await import('bcryptjs');
    
    // Create new user with default password
    const defaultPassword = 'newuser123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 12);

    const newUser = fileStorage.createUser({
      email,
      name,
      password: hashedPassword,
      role,
      isActive: true
    });

    return NextResponse.json({
      success: true,
      message: `User created successfully. Default password: ${defaultPassword}`,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          isActive: newUser.isActive,
          createdAt: newUser.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Create user API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
