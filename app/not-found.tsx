import Link from 'next/link';
import { Home, Heart } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <Heart className="w-16 h-16 text-pink-400 mx-auto mb-6" />
        
        <h1 className="font-playfair text-3xl font-light text-neutral-800 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-neutral-600 mb-6 leading-relaxed">
          Looks like this page doesn't exist, chuchi! 
          Let's get you back to our memories. 💕
        </p>
        
        <Link href="/">
          <button className="flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 mx-auto">
            <Home className="w-4 h-4" />
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}