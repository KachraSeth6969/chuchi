"use client";

import { useAuth } from '../lib/auth-context';

export default function LogoutButton() {
  const { logout, user } = useAuth();

  if (!user) return null;

  return (
    <button 
      onClick={logout}
      className="fixed top-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
    >
      Logout ({user.name})
    </button>
  );
}