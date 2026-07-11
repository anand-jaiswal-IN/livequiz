import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, className = '', ...props }, ref) => {
    const containerStyle = fullWidth ? 'w-full' : '';
    
    return (
      <div className={`flex flex-col gap-1.5 ${containerStyle}`}>
        {label && (
          <label className="text-sm font-medium text-gray-300 light:text-slate-700">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            px-4 py-3 bg-gray-900/60 light:bg-slate-100 border rounded-xl text-white light:text-slate-900 placeholder-gray-500 light:placeholder-slate-400
            transition-all duration-200 outline-none
            ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-800 light:border-slate-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10'}
            ${fullWidth ? 'w-full' : ''}
            ${className}
          `}
          {...props}
        />
        {error && (
          <span className="text-xs text-red-400 font-medium">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
