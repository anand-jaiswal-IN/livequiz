import React from 'react';

interface StatsCardProps {
  value: string | number;
  title: string;
  icon: React.ReactNode;
  description?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'info';
}

export default function StatsCard({
  value,
  title,
  icon,
  description,
  color = 'primary',
}: StatsCardProps) {
  const glowColors = {
    primary: 'hover:border-violet-500/30 hover:shadow-violet-500/5 text-violet-400',
    secondary: 'hover:border-pink-500/30 hover:shadow-pink-500/5 text-pink-400',
    accent: 'hover:border-emerald-500/30 hover:shadow-emerald-500/5 text-emerald-400',
    info: 'hover:border-cyan-500/30 hover:shadow-cyan-500/5 text-cyan-400',
  };

  return (
    <div
      className={`
        glass-panel rounded-2xl p-6 border border-gray-800/80
        flex items-center gap-5 transition-all duration-300
        ${glowColors[color]}
      `}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 text-2xl select-none">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-1">
          {title}
        </span>
        <h3 className="text-3xl font-extrabold text-white tracking-tight">
          {value}
        </h3>
        {description && (
          <p className="text-xs text-gray-500 mt-1 truncate">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
