import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { label, error, className = '', containerClassName = '', ...props },
  ref
) {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
          {props.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors duration-200
          bg-white dark:bg-slate-800
          border-slate-300 dark:border-slate-600
          text-slate-900 dark:text-slate-100
          placeholder:text-slate-400 dark:placeholder:text-slate-500
          focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default Input;
