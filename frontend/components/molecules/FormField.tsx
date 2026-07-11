import React from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}

export default function FormField({
  label,
  error,
  children,
  required = false,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-sm font-semibold text-gray-300 flex items-center gap-1 px-0.5">
        {label}
        {required && <span className="text-pink-500">*</span>}
      </label>
      {children}
      {error && (
        <span className="text-xs text-red-400 font-medium px-0.5 animate-slide-up">
          {error}
        </span>
      )}
    </div>
  );
}
