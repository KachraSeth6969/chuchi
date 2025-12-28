"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

interface FABOption {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  options: FABOption[];
  className?: string;
}

export default function FloatingActionButton({ options, className = "" }: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleOptionClick = (option: FABOption) => {
    option.onClick();
    setIsExpanded(false); // Close after selection
  };

  return (
    <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
      {/* Expanded options */}
      {isExpanded && (
        <div className="absolute bottom-16 right-0 flex flex-col gap-2 animate-in slide-in-from-bottom-2 duration-200">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className={`flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-md border border-neutral-200 hover:bg-neutral-50 transition-all duration-200 ${
                option.color || 'text-neutral-700'
              } group min-w-[160px]`}
              title={option.label}
            >
              <div className="w-5 h-5 flex-shrink-0">
                {option.icon}
              </div>
              <span className="text-sm font-medium whitespace-nowrap">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      )}
      
      {/* Main FAB button */}
      <button
        onClick={toggleExpand}
        className={`bg-white/95 backdrop-blur-sm rounded-full w-14 h-14 flex items-center justify-center shadow-md border border-neutral-200 hover:bg-neutral-50 transition-all duration-200 ${
          isExpanded ? 'rotate-45' : 'rotate-0'
        }`}
        title={isExpanded ? "Close menu" : "Open menu"}
      >
        {isExpanded ? (
          <X className="w-6 h-6 text-neutral-700" />
        ) : (
          <Plus className="w-6 h-6 text-neutral-700" />
        )}
      </button>
    </div>
  );
}