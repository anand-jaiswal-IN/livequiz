'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser, registerUser, clearAuthError } from '@/store/authSlice';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import FormField from '../molecules/FormField';
import Link from 'next/link';

interface AuthFormProps {
  type: 'login' | 'signup';
}

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  // Form states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // Clear slice errors on mount/unmount
  useEffect(() => {
    dispatch(clearAuthError());
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch, type]);

  // If authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (type === 'signup' && !username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (type === 'login') {
      dispatch(loginUser({ email, password }));
    } else {
      dispatch(registerUser({ username, email, password }));
    }
  };

  return (
    <div className="glass-panel w-full max-w-md p-8 rounded-3xl border border-violet-500/10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-white light:text-slate-800 tracking-tight mb-2">
          {type === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-gray-400 light:text-slate-500 text-sm">
          {type === 'login' 
            ? 'Sign in to manage and launch your quizzes' 
            : 'Register to start creating live interactive quizzes'}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium animate-slide-up">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {type === 'signup' && (
          <FormField label="Username" error={fieldErrors.username} required>
            <Input
              type="text"
              placeholder="e.g. quizmaster99"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
            />
          </FormField>
        )}

        <FormField label="Email Address" error={fieldErrors.email} required>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
        </FormField>

        <FormField label="Password" error={fieldErrors.password} required>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
        </FormField>

        <Button
          type="submit"
          variant={type === 'login' ? 'primary' : 'secondary'}
          isLoading={loading}
          fullWidth
          className="mt-2 py-3"
        >
          {type === 'login' ? 'Sign In' : 'Get Started'}
        </Button>
      </form>

      <div className="text-center mt-6 text-sm text-gray-500 light:text-slate-500 font-medium">
        {type === 'login' ? (
          <>
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-violet-400 light:text-violet-600 hover:text-violet-300 light:hover:text-violet-800 font-bold transition-colors">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link href="/auth/login" className="text-pink-400 light:text-pink-600 hover:text-pink-300 light:hover:text-pink-800 font-bold transition-colors">
              Sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
