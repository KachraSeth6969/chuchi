"use client";

import { useAuth } from './auth-provider';
import { useAudio } from './global-audio-provider';
import PasswordScreen from './password-screen';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, authenticate } = useAuth();
  const { startPlayback } = useAudio();

  const handleAuthentication = () => {
    authenticate();
    // Small delay to ensure DOM is ready, then start audio with user interaction
    setTimeout(() => {
      startPlayback();
    }, 100);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <PasswordScreen onAuthenticated={handleAuthentication} />
      </div>
    );
  }

  return <>{children}</>;
}