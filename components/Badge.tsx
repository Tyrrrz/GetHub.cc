import c from 'classnames';
import type { ReactNode } from 'react';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  outlined?: boolean;
  className?: string;
}

export const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  outlined = false,
  className
}: BadgeProps) => {
  return (
    <span
      className={c(
        'inline-flex',
        'items-center',
        'rounded',
        'px-2',
        {
          // Default variant
          'bg-gray-100': variant === 'default' && !outlined,
          'dark:bg-gray-800': variant === 'default' && !outlined,
          'text-gray-700': variant === 'default',
          'dark:text-gray-400': variant === 'default',
          'border': variant === 'default',
          'border-gray-300': variant === 'default',
          'dark:border-gray-700': variant === 'default'
        },
        {
          // Primary variant
          'bg-blue-600': variant === 'primary' && !outlined,
          'dark:bg-blue-500': variant === 'primary' && !outlined,
          'text-white': variant === 'primary' && !outlined,
          'dark:text-gray-950': variant === 'primary' && !outlined,
          'border-2': variant === 'primary' && outlined,
          'border-blue-600': variant === 'primary' && outlined,
          'dark:border-blue-500': variant === 'primary' && outlined,
          'text-blue-700': variant === 'primary' && outlined,
          'dark:text-blue-400': variant === 'primary' && outlined,
          'font-medium': variant === 'primary'
        },
        {
          // Success variant
          'bg-green-600': variant === 'success' && !outlined,
          'dark:bg-green-700': variant === 'success' && !outlined,
          'text-white': variant === 'success' && !outlined,
          'dark:text-gray-100': variant === 'success' && !outlined,
          'border-2': variant === 'success' && outlined,
          'text-green-700': variant === 'success' && outlined,
          'dark:text-green-400': variant === 'success' && outlined,
          'border-green-600': variant === 'success' && outlined,
          'dark:border-green-600': variant === 'success' && outlined,
          'font-medium': variant === 'success'
        },
        {
          // Warning variant
          'bg-yellow-50': variant === 'warning' && !outlined,
          'dark:bg-yellow-900/20': variant === 'warning',
          'text-yellow-700': variant === 'warning',
          'dark:text-yellow-500': variant === 'warning',
          'border-yellow-200': variant === 'warning',
          'dark:border-yellow-700': variant === 'warning'
        },
        {
          // Danger variant
          'bg-red-600': variant === 'danger' && !outlined,
          'dark:bg-red-700': variant === 'danger' && !outlined,
          'text-white': variant === 'danger' && !outlined,
          'dark:text-gray-100': variant === 'danger' && !outlined,
          'border-2': variant === 'danger' && outlined,
          'border-red-600': variant === 'danger' && outlined,
          'dark:border-red-500': variant === 'danger' && outlined,
          'text-red-700': variant === 'danger' && outlined,
          'dark:text-red-400': variant === 'danger' && outlined,
          'font-medium': variant === 'danger'
        },
        {
          // Sizes
          'py-0.5': size === 'sm',
          'text-xs': size === 'sm',
          'py-1': size === 'md',
          'text-sm': size === 'md'
        },
        className
      )}
    >
      {children}
    </span>
  );
};
