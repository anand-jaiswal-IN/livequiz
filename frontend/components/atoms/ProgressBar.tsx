import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  color?: 'primary' | 'secondary' | 'accent' | 'danger';
  className?: string;
  showText?: boolean;
}

export default function ProgressBar({
  value,
  max,
  color = 'primary',
  className = '',
  showText = false,
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  
  const colors = {
    primary: 'bg-primary shadow-lg shadow-violet-500/30',
    secondary: 'bg-secondary shadow-lg shadow-pink-500/30',
    accent: 'bg-accent shadow-lg shadow-emerald-500/30',
    danger: 'bg-red-500 shadow-lg shadow-red-500/30',
  };

  return (
    <div className={`w-full flex flex-col gap-1 ${className}`}>
      <div className="w-full h-3 bg-gray-900 light:bg-slate-200 border border-gray-800 light:border-slate-300 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ease-out ${colors[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showText && (
        <div className="flex justify-between text-xs text-gray-400 light:text-slate-500 font-semibold px-0.5">
          <span>{Math.round(value)}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}
