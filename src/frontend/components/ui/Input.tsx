import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full min-h-[44px] px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 text-slate-900 dark:text-slate-100 ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-400/40'
              : 'border-slate-300 dark:border-slate-700 focus:border-teal-500 focus:ring-teal-500/30'
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-xs text-rose-500 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={`w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-900 border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 text-slate-900 dark:text-slate-100 resize-y min-h-[88px] ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-400/40'
              : 'border-slate-300 dark:border-slate-700 focus:border-teal-500 focus:ring-teal-500/30'
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-xs text-rose-500 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
