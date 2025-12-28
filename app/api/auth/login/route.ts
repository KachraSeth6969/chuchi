import { NextRequest, NextResponse } from 'next/server';
import { detectDevice, validateCredentials, createAuthToken } from '../../../../lib/auth-config';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Detect device from user agent
    const userAgent = request.headers.get('user-agent') || '';
    const device = detectDevice(userAgent);
    
    // Accept iPhone, Android, and Desktop devices
    if (!['iPhone', 'Android', 'Desktop'].includes(device)) {
      return NextResponse.json(
        { error: 'Device not supported. Please use iPhone, Android, or Desktop.' },
        { status: 400 }
      );
    }

    // Validate credentials
    const user = validateCredentials(device, password);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid password for this device' },
        { status: 401 }
      );
    }

    // Create auth token
    const token = createAuthToken(user);
    
    // Return success without setting cookies (session-only authentication)
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        device: user.device
      }
    });

    return response;

  } catch (error) {
    console.error('Auth login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  // Logout endpoint
  const response = NextResponse.json({ success: true });
  
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  });

  return response;
}