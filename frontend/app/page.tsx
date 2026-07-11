'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { initializeAuth } from '@/store/authSlice';
import Navbar from '@/components/organisms/Navbar';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import FormField from '@/components/molecules/FormField';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Initialize session checks
  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const code = joinCode.trim();
    if (!code) {
      setError('Please enter a join code.');
      return;
    }

    if (code.length !== 6 || isNaN(Number(code))) {
      setError('Join code must be a 6-digit number.');
      return;
    }

    router.push(`/quiz/${code}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Main landing container */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto px-4 py-16 sm:py-24 text-center relative">
        {/* Floating gradient ambient lights */}
        <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-violet-600/10 blur-[120px] pointer-events-none pulse-glow" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-pink-600/10 blur-[120px] pointer-events-none pulse-glow" style={{ animationDelay: '2.5s' }} />

        <div className="relative z-10 flex flex-col items-center max-w-3xl">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-500/10 border border-violet-500/20 text-violet-300 mb-6 uppercase tracking-wider animate-slide-up">
            ⚡ Play & Create Live Game Shows
          </span>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-black text-white light:text-slate-900 leading-tight tracking-tight mb-6 animate-slide-up">
            Host Interactive Quizzes with{' '}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent glow-text-primary">
              Live Leaderboards
            </span>
          </h1>

          <p className="text-gray-400 light:text-slate-600 text-lg sm:text-xl font-medium mb-12 max-w-2xl leading-relaxed animate-slide-up">
            Create customized quiz games, invite players through a 6-digit pin or direct link, and watch scores update in real-time. Perfectly responsive for mobiles and desktops.
          </p>

          {/* Join Game Box */}
          <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-violet-500/15 mb-12 animate-scale-in">
            <h2 className="text-xl font-black text-white light:text-slate-800 mb-6 flex items-center justify-center gap-2">
              <span>🎮</span> Enter Join PIN
            </h2>

            <form onSubmit={handleJoin} className="flex flex-col gap-4">
              <FormField error={error || undefined} label="">
                <Input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit code (e.g. 847291)"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, ''))}
                  className="text-center text-2xl font-black tracking-widest py-4 border-violet-500/20 light:border-violet-500/30 bg-gray-950/40 light:bg-slate-100 focus:border-violet-500 light:text-slate-900"
                  fullWidth
                />
              </FormField>
              
              <Button
                type="submit"
                variant="secondary"
                className="py-4 text-lg font-extrabold w-full"
              >
                Join Live Game 🚀
              </Button>
            </form>
          </div>

          {/* Quick Creator CTA */}
          <div className="flex flex-wrap justify-center items-center gap-4 animate-slide-up">
            <span className="text-sm font-semibold text-gray-500 light:text-slate-500">Want to host your own quiz?</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="border-gray-800 light:border-slate-300 hover:border-violet-500/40 text-violet-300 light:text-violet-600"
            >
              Go to Host Dashboard ➡️
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-900 light:border-slate-200 bg-gray-950/20 light:bg-slate-50 py-6 text-center text-xs text-gray-600 light:text-slate-500 font-bold select-none">
        &copy; {new Date().getFullYear()} LiveQuiz. Built with Next.js, Redux, and Tailwind v4.
      </footer>
    </div>
  );
}
