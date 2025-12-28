"use client";

import { useEffect } from 'react';

export default function GlobalErrorHandler() {
  useEffect(() => {
    // Handle global JavaScript errors
    const handleError = (event: ErrorEvent) => {
      // Ignore Web3/Ethereum errors
      if (event.message.includes('ethereum') || 
          event.message.includes('web3') ||
          event.message.includes('selectedAddress')) {
        console.log('Web3 error ignored:', event.message);
        event.preventDefault();
        return false;
      }
    };

    // Handle unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('ethereum') ||
          event.reason?.message?.includes('web3')) {
        console.log('Web3 promise rejection ignored:', event.reason.message);
        event.preventDefault();
        return;
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return null; // This component doesn't render anything
}