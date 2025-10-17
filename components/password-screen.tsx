"use client";

import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordScreenProps {
  onAuthenticated: () => void;
}

export default function PasswordScreen({ onAuthenticated }: PasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const correctPassword = 'supernova'; // Same as Android app

  useEffect(() => {
    // Focus input when component mounts
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.toLowerCase() === correctPassword.toLowerCase()) {
      // Clear any errors
      setError('');
      
      // Ensure audio context is unlocked by this user interaction
      try {
        const audioElements = document.querySelectorAll('audio');
        audioElements.forEach(audio => {
          if (audio.paused) {
            // This user interaction should unlock audio for the entire session
            const playPromise = audio.play();
            if (playPromise) {
              playPromise.catch(() => {
                // Ignore errors here, we're just trying to unlock audio
              });
            }
          }
        });
      } catch (e) {
        // Ignore errors
      }
      
      // Authenticate user
      onAuthenticated();
    } else {
      // Show error and clear input
      setError('Try again ✨');
      setPassword('');
      
      // Shake animation
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
      
      // Refocus input
      inputRef.current?.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-center max-w-3xl mx-auto">
          {/* Subtitle */}
          <p className="text-base md:text-lg text-neutral-600 mb-12 leading-relaxed max-w-2xl mx-auto font-light">
            Enter the secret to unlock our memories
          </p>

          {/* Password Form */}
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <input
                  ref={inputRef}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  className={`w-full px-6 py-4 bg-white border-2 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-all duration-200 font-light text-lg ${
                    isShaking ? 'animate-shake border-red-400' : 'border-neutral-200'
                  } ${error ? 'border-red-400' : ''}`}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck="false"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors duration-200"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-500 text-sm text-center animate-fadeIn font-light">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!password.trim()}
                className="w-full text-neutral-800 font-medium py-4 px-8 rounded-lg text-base transition-all duration-200 border border-neutral-300 hover:border-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: '#D8BFF8' }}
              >
                Unlock Memories
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}