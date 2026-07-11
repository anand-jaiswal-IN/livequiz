'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { initializeAuth, logoutUser } from '@/store/authSlice';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardContent({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, user } = useAppSelector((state) => state.auth);

  // Sidebar collapsible state
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Initialize auth from localStorage on mount
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Protect dashboard routes
  useEffect(() => {
    const token = localStorage.getItem('ll_access_token');
    if (!token && !loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  // Determine active view from pathname instead of query params
  const getActiveView = () => {
    if (pathname.startsWith('/dashboard/quizzes') || pathname.startsWith('/dashboard/leaderboards')) {
      return 'quizzes';
    }
    if (pathname.startsWith('/dashboard/sessions')) {
      return 'sessions';
    }
    if (pathname.startsWith('/dashboard/analytics')) {
      return 'analytics';
    }
    return 'quizzes'; // Fallback
  };

  const activeView = getActiveView();

  const token = typeof window !== 'undefined' ? localStorage.getItem('ll_access_token') : null;
  
  if (!isAuthenticated && !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm font-semibold">Verifying your session...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push('/auth/login');
  };

  const navItems = [
    {
      id: 'quizzes',
      label: 'Quizzes',
      route: '/dashboard/quizzes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'sessions',
      label: 'Live Sessions',
      route: '/dashboard/sessions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'analytics',
      label: 'Analytics',
      route: '/dashboard/analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10a2 2 0 01-2 2h-2a2 2 0 01-2-2zm9-3h-2a2 2 0 00-2 2v3a2 2 0 002 2h2a2 2 0 002-2v-3a2 2 0 00-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-[#0B0F19] text-gray-200 overflow-hidden">
      {/* LEFT SIDEBAR */}
      <aside 
        className={`flex flex-col bg-gray-950/80 border-r border-violet-500/10 backdrop-blur-xl h-full transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Header / Logo */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-900/60">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="text-2xl shrink-0">⚡</span>
            {!isCollapsed && (
              <span className="text-lg font-black text-white tracking-wider uppercase animate-fade-in">
                LiveQuiz
              </span>
            )}
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-500 hover:text-violet-400 p-1.5 rounded-lg hover:bg-gray-900/40 transition-colors"
          >
            {isCollapsed ? '➡️' : '⬅️'}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.route)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold text-sm transition-all duration-200 group group-hover:bg-gray-900/40 ${
                  isActive 
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/15' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-900/40'
                }`}
              >
                <div className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-violet-400'
                }`}>
                  {item.icon}
                </div>
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer / User Profile Card */}
        <div className="p-4 border-t border-gray-900/60 bg-gray-950/40">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center font-black text-white text-base shrink-0">
              {user?.username?.substring(0, 2).toUpperCase() || 'U'}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 animate-fade-in">
                <h4 className="text-sm font-bold text-white truncate">{user?.username}</h4>
                <p className="text-[10px] text-gray-500 truncate font-semibold uppercase tracking-wider">{user?.email}</p>
              </div>
            )}
            {!isCollapsed && (
              <button 
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-950/10 transition-colors shrink-0 cursor-pointer"
                title="Logout Account"
              >
                Logout
              </button>
            )}
          </div>
          {isCollapsed && (
            <button 
              onClick={handleLogout}
              className="w-full mt-3 text-center text-gray-500 hover:text-red-400 py-2 rounded-lg hover:bg-red-950/10 transition-colors block text-xs"
              title="Logout Account"
            >
              Logout
            </button>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header / Quick Navbar */}
        <header className="flex md:hidden items-center justify-between px-6 py-4 bg-gray-950/80 border-b border-violet-500/10">
          <span className="text-xl font-black text-white">⚡ LiveQuiz</span>
          <button onClick={handleLogout} className="text-sm text-red-400 font-bold">Logout</button>
        </header>

        <main className="flex-1 overflow-y-auto px-6 sm:px-10 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  );
}
