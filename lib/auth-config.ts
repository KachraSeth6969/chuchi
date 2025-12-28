// Simple authentication system for edit mode access
export interface AuthUser {
  id: string;
  name: string;
  device: 'iPhone' | 'Android';
  authenticated: boolean;
}

export const AUTH_CONFIG = {
  // Universal password for all devices
  UNIVERSAL_PASSWORD: 'supernova',
  
  // Session duration (30 days in milliseconds)
  SESSION_DURATION: 30 * 24 * 60 * 60 * 1000,
};

export function detectDevice(userAgent: string): 'iPhone' | 'Android' | 'Desktop' {
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('iphone') || ua.includes('ios')) {
    return 'iPhone';
  }
  
  if (ua.includes('android')) {
    return 'Android';
  }
  
  return 'Desktop';
}

export function validateCredentials(device: string, password: string): AuthUser | null {
  const deviceType = device as 'iPhone' | 'Android' | 'Desktop';
  
  // Case insensitive password check
  if (password.toLowerCase() === AUTH_CONFIG.UNIVERSAL_PASSWORD.toLowerCase()) {
    if (deviceType === 'iPhone') {
      return {
        id: 'iphone-user',
        name: 'iPhone User',
        device: 'iPhone',
        authenticated: true
      };
    }
    
    if (deviceType === 'Android') {
      return {
        id: 'android-user', 
        name: 'Android User',
        device: 'Android',
        authenticated: true
      };
    }
    
    if (deviceType === 'Desktop') {
      return {
        id: 'desktop-user',
        name: 'Desktop User', 
        device: 'iPhone', // Use iPhone for compatibility
        authenticated: true
      };
    }
  }
  
  return null;
}

export function createAuthToken(user: AuthUser): string {
  const payload = {
    user,
    expiresAt: Date.now() + AUTH_CONFIG.SESSION_DURATION
  };
  
  // Simple token encoding (in production, use proper JWT)
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function validateAuthToken(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    
    if (payload.expiresAt < Date.now()) {
      return null; // Token expired
    }
    
    return payload.user;
  } catch (error) {
    return null; // Invalid token
  }
}