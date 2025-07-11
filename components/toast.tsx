"use client";

import { useEffect, useState } from "react";
import { Music, X } from "lucide-react";

interface ToastProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export function Toast({ show, message, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-6 right-6 z-50">
      <div
        className={`
        bg-white border border-neutral-200 text-neutral-900 px-6 py-4 rounded-lg shadow-lg
        transform transition-all duration-300 ease-out
        ${show ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
      >
        <div className="flex items-center gap-3">
          <Music className="w-5 h-5 text-neutral-700" />
          <span className="font-medium text-sm text-neutral-900">
            {message}
          </span>
          <button
            onClick={onClose}
            className="ml-2 hover:bg-neutral-100 rounded-full p-1 transition-colors duration-200"
          >
            <X className="w-4 h-4 text-neutral-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
