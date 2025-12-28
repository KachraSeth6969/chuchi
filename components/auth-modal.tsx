"use client";

import { useState } from 'react';
import { X, Lock, Smartphone, AlertCircle } from 'lucide-react';
import { useAuth } from '../lib/auth-context';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await login(password);

    if (result.success) {
      setPassword('');
      onSuccess?.();
      onClose();
    } else {
      setError(result.error || 'Authentication failed');
    }

    setIsLoading(false);
  };

  const detectCurrentDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('iphone') || userAgent.includes('ios')) {
      return 'iPhone';
    }
    if (userAgent.includes('android')) {
      return 'Android';
    }
    return 'Unknown';
  };

  if (!isOpen) return null;

  const currentDevice = detectCurrentDevice();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-neutral-700" />
            <h2 className="text-xl font-bold text-neutral-900">Edit Mode Access</h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              Detected Device: {currentDevice}
            </span>
          </div>
          <p className="text-xs text-blue-700">
            {currentDevice === 'iPhone' 
              ? 'You can use the shared access password for iPhone devices.'
              : currentDevice === 'Android'
              ? 'Please use the Android-specific password.'
              : 'Device detection failed. Please ensure you\'re using iPhone or Android.'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Enter ${currentDevice} password`}
              required
              disabled={currentDevice === 'Unknown'}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || currentDevice === 'Unknown'}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Authenticating...' : 'Access Edit Mode'}
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
          <p className="text-xs text-neutral-600">
            <strong>iPhone:</strong> Shared access with the main password<br/>
            <strong>Android:</strong> Separate password for security
          </p>
        </div>
      </div>
    </div>
  );
}