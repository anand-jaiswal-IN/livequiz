'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser } from '@/store/authSlice';
import Button from '../atoms/Button';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push('/');
  };

  return (
    <header className="w-full glass-panel border-b border-gray-800/80 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 select-none group">
          <span className="text-2xl animate-spin [animation-duration:8s]">🔮</span>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 to-pink-500 bg-clip-text text-transparent group-hover:from-violet-300 group-hover:to-pink-400 transition-all duration-300">
            LiveQuiz
          </span>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-gray-300 hover:text-white transition-colors duration-200"
              >
                Dashboard
              </Link>
              <div className="h-4 w-px bg-gray-800" />
              <div className="flex items-center gap-3">
                <div className="flex flex-col text-right hidden sm:flex">
                  <span className="text-xs font-bold text-gray-400">Host Account</span>
                  <span className="text-sm font-semibold text-violet-300 truncate max-w-32">
                    {user.username}
                  </span>
                </div>
                <div className="w-8 h-8 rounded-full bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-sm font-bold text-violet-300 select-none">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-400 hover:bg-red-950/15"
                >
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="primary" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
