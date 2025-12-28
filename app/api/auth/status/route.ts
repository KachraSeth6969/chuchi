import { NextRequest, NextResponse } from 'next/server';
import { validateAuthToken } from '../../../../lib/auth-config';

export async function GET(request: NextRequest) {
  try {
    // Always return unauthenticated and clear any existing cookies
    const response = NextResponse.json({ authenticated: false });
    
    // Clear any existing auth cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/'
    });
    
    return response;

  } catch (error) {
    console.error('Auth status error:', error);
    return NextResponse.json({ authenticated: false });
  }
}