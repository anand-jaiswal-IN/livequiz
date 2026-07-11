'use client';

import React from 'react';
import Navbar from '../organisms/Navbar';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative">
        {/* Floating blurred background circles */}
        <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-violet-600/10 blur-[100px] pointer-events-none pulse-glow" />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full bg-pink-600/10 blur-[100px] pointer-events-none pulse-glow" style={{ animationDelay: '2s' }} />
        
        <div className="relative z-10 w-full flex justify-center">
          {children}
        </div>
      </div>
    </div>
  );
}
