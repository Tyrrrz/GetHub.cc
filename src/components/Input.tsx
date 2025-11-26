import c from 'classnames';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  label?: string;
  error?: string;
}

export const Input = ({ icon, label, error, className, ...props }: InputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={props.id}
          className={c([
            'block',
            'text-sm',
            'font-medium',
            'text-gray-900',
            'dark:text-gray-100',
            'mb-2'
          ])}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div
            className={c([
              'absolute',
              'inset-y-0',
              'left-0',
              'pl-3',
              'flex',
              'items-center',
              'pointer-events-none'
            ])}
          >
            <span className={c(['text-gray-500', 'dark:text-gray-400'])}>{icon}</span>
          </div>
        )}
        <input
          className={c([
            'block',
            'w-full',
            icon ? 'pl-10' : 'pl-3',
            'pr-3',
            'py-2',
            'border',
            error ? 'border-red-600 dark:border-red-500' : 'border-gray-300 dark:border-gray-700',
            'rounded-md',
            'text-sm',
            'bg-white',
            'dark:bg-gray-800',
            'text-gray-900',
            'dark:text-gray-100',
            'placeholder-gray-500',
            'dark:placeholder-gray-400',
            'focus:outline-none',
            'focus:ring-2',
            'focus:ring-blue-500',
            'dark:focus:ring-blue-500',
            'focus:border-blue-500',
            'dark:focus:border-blue-500',
            'disabled:opacity-50',
            'disabled:cursor-not-allowed',
            className
          ])}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};
