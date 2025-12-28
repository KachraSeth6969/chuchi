"use client";

import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../lib/auth-context';

interface PasswordScreenProps {
  onAuthenticated: () => void;
}

export default function PasswordScreen({ onAuthenticated }: PasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { login } = useAuth();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const result = await login(password);
      
      if (result.success) {
        // Ensure audio context is unlocked by this user interaction
        try {
          const audioElements = document.querySelectorAll('audio');
          audioElements.forEach(audio => {
            if (audio.paused) {
              const playPromise = audio.play();
              if (playPromise) {
                playPromise.catch(() => {});
              }
            }
          });
        } catch (e) {}
        
        onAuthenticated();
      } else {
        setError(result.error || 'Try again ✨');
        setPassword('');
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 300);
        inputRef.current?.focus();
      }
    } catch (err) {
      setError('Try again ✨');
      setPassword('');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 300);
      inputRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-base md:text-lg text-neutral-600 mb-12 leading-relaxed max-w-2xl mx-auto font-light">
            Enter the secret to unlock our memories
          </p>

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

              {error && (
                <div className="text-red-500 text-sm text-center animate-fadeIn font-light">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!password.trim() || isLoading}
                className="w-full text-neutral-800 font-medium py-4 px-8 rounded-lg text-base transition-all duration-200 border border-neutral-300 hover:border-neutral-400 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: '#D8BFF8' }}
              >
                {isLoading ? 'Unlocking...' : 'Unlock Memories'}
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="text-center pb-8 px-6">
        <p className="text-neutral-500 text-sm font-light">
          Our little universe of moments ✨
        </p>
      </footer>
    </div>
  );
}