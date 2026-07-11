import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export default function Badge({
  children,
  variant = 'primary',
  className = '',
}: BadgeProps) {
  const styles = {
    primary: 'bg-violet-500/10 text-violet-300 border border-violet-500/20',
    secondary: 'bg-pink-500/10 text-pink-300 border border-pink-500/20',
    success: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
    danger: 'bg-red-500/10 text-red-300 border border-red-500/20',
    info: 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wider ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
