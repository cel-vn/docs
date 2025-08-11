import { NextRequest, NextResponse } from 'next/server';
import { edgeConfigService } from '@/lib/edge-config';

export async function POST(request: NextRequest) {
  try {
    await edgeConfigService.initializeDefaultUsers();
    
    return NextResponse.json({
      success: true,
      message: 'Default users initialized successfully'
    });
  } catch (error) {
    console.error('Initialize users error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to initialize users' },
      { status: 500 }
    );
  }
}
