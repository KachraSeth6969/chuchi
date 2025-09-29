import { Heart } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <Heart className="w-8 h-8 text-pink-400 mx-auto mb-4 animate-pulse" />
        <h2 className="font-playfair text-lg text-neutral-700 mb-2">Loading...</h2>
        <p className="text-sm text-neutral-500">Preparing your memories ✨</p>
      </div>
    </div>
  );
}