"use client";

import { useAuth } from '../lib/auth-context';
import { useAudio } from './global-audio-provider';
import PasswordScreen from './password-screen';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { startPlayback } = useAudio();

  const handleAuthentication = () => {
    // Small delay to ensure DOM is ready, then start audio with user interaction
    setTimeout(() => {
      startPlayback();
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-fuchsia-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <PasswordScreen onAuthenticated={handleAuthentication} />
      </div>
    );
  }

  return <>{children}</>;
}