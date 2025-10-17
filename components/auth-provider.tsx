"use client";

import { createContext, useContext, useState, useEffect, useRef } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  authenticate: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const lastActivityRef = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const visibilityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Force logout if loaded from Android app or with android parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const isAndroid = urlParams.get('android') === '1' || 
                     /Android/.test(navigator.userAgent) ||
                     /ChuchiLoveApp/.test(navigator.userAgent);
    
    console.log('AuthProvider init:', { 
      isAndroid, 
      userAgent: navigator.userAgent,
      androidParam: urlParams.get('android'),
      currentAuth: isAuthenticated 
    });
    
    if (isAndroid) {
      console.log('Android app detected - forcing logout');
      setIsAuthenticated(false);
    }
  }, []);

  // Debug authentication state changes
  useEffect(() => {
    console.log('AuthProvider: isAuthenticated changed to', isAuthenticated);
  }, [isAuthenticated]);

  // Session timeout (30 minutes of inactivity)
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  
  // Visibility timeout (immediate logout when tab becomes hidden)
  const VISIBILITY_TIMEOUT = 1000; // 1 second delay to avoid false triggers

  const authenticate = () => {
    console.log('AuthProvider: authenticate() called');
    setIsAuthenticated(true);
    lastActivityRef.current = Date.now();
    resetTimeout();
  };

  const logout = () => {
    console.log('AuthProvider: logout() called');
    setIsAuthenticated(false);
    clearTimeouts();
  };

  const clearTimeouts = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (visibilityTimeoutRef.current) {
      clearTimeout(visibilityTimeoutRef.current);
      visibilityTimeoutRef.current = null;
    }
  };

  const resetTimeout = () => {
    clearTimeouts();
    
    if (isAuthenticated) {
      timeoutRef.current = setTimeout(() => {
        logout();
      }, SESSION_TIMEOUT);
    }
  };

  // Track user activity to reset session timeout
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleActivity = () => {
      lastActivityRef.current = Date.now();
      resetTimeout();
    };

    // Activity events
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [isAuthenticated]);

  // Handle tab visibility changes (similar to Android onPause/onResume)
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab became hidden - set a timeout to logout
        visibilityTimeoutRef.current = setTimeout(() => {
          logout();
        }, VISIBILITY_TIMEOUT);
      } else {
        // Tab became visible - clear the timeout if user returns quickly
        if (visibilityTimeoutRef.current) {
          clearTimeout(visibilityTimeoutRef.current);
        }
        // Reset activity timer
        lastActivityRef.current = Date.now();
        resetTimeout();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated]);

  // Handle window blur/focus (when switching to other applications)
  useEffect(() => {
    if (!isAuthenticated) return;

    const handleBlur = () => {
      // Window lost focus - set a timeout to logout
      visibilityTimeoutRef.current = setTimeout(() => {
        logout();
      }, VISIBILITY_TIMEOUT);
    };

    const handleFocus = () => {
      // Window gained focus - clear timeout if user returns quickly
      if (visibilityTimeoutRef.current) {
        clearTimeout(visibilityTimeoutRef.current);
      }
      lastActivityRef.current = Date.now();
      resetTimeout();
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isAuthenticated]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      clearTimeouts();
    };
  }, []);

  const value = {
    isAuthenticated,
    authenticate,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}