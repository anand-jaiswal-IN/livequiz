import React from 'react';

interface LeaderboardRowProps {
  rank: number;
  nickname: string;
  score: number;
  isCurrentUser?: boolean;
  totalQuestions?: number;
  correctAnswers?: number;
}

export default function LeaderboardRow({
  rank,
  nickname,
  score,
  isCurrentUser = false,
  totalQuestions = 0,
  correctAnswers = 0,
}: LeaderboardRowProps) {
  // Rank styling
  const isPodium = rank <= 3;
  const rankColors = {
    1: 'bg-amber-500 text-amber-950 glow-border',
    2: 'bg-slate-300 text-slate-900',
    3: 'bg-amber-700 text-amber-50',
  };

  const rankBadgeStyle = isPodium 
    ? rankColors[rank as 1 | 2 | 3]
    : 'bg-gray-800 text-gray-400 border border-gray-700';

  const containerStyle = isCurrentUser
    ? 'border-violet-500/50 bg-violet-950/20 shadow-md shadow-violet-500/5'
    : 'border-gray-800/80 bg-gray-900/40 hover:bg-gray-900/60';

  return (
    <div
      className={`
        flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 animate-slide-up
        ${containerStyle}
      `}
    >
      <div
        className={`
          flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm select-none
          ${rankBadgeStyle}
        `}
      >
        {rank}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className={`font-bold truncate text-base ${isCurrentUser ? 'text-violet-300' : 'text-white'}`}>
          {nickname}
          {isCurrentUser && <span className="ml-2 text-xs font-normal text-violet-400/80">(You)</span>}
        </h4>
        {totalQuestions > 0 && (
          <p className="text-xs text-gray-400 mt-0.5">
            Correct: {correctAnswers} / {totalQuestions}
          </p>
        )}
      </div>

      <div className="text-right">
        <span className={`text-lg font-extrabold tracking-tight ${isPodium ? 'text-violet-300' : 'text-gray-200'}`}>
          {score.toLocaleString()}
        </span>
        <span className="text-[10px] text-gray-500 block font-bold uppercase tracking-wider">PTS</span>
      </div>
    </div>
  );
}
