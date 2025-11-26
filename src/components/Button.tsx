import c from 'classnames';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ElementType, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonBaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  children: ReactNode;
  as?: ElementType;
};

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button';
  };

type ButtonAsAnchor = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: 'a';
  };

type ButtonAsComponent = ButtonBaseProps & {
  as: ElementType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

type ButtonProps = ButtonAsButton | ButtonAsAnchor | ButtonAsComponent;

export const Button = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className,
  as: Component = 'button',
  ...props
}: ButtonProps) => {
  const classes = c(
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'rounded-md',
    'border',
    'border-transparent',
    'transition-colors',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    {
      // Primary variant
      'text-white': variant === 'primary',
      'bg-blue-600': variant === 'primary',
      'hover:bg-blue-700': variant === 'primary',
      'dark:bg-blue-600': variant === 'primary',
      'dark:hover:bg-blue-500': variant === 'primary',
      'focus:ring-blue-500': variant === 'primary',
      'dark:focus:ring-blue-600': variant === 'primary'
    },
    {
      // Secondary variant
      'text-gray-900': variant === 'secondary',
      'dark:text-gray-100': variant === 'secondary',
      'bg-white': variant === 'secondary',
      'dark:bg-gray-800': variant === 'secondary',
      'border-gray-300': variant === 'secondary',
      'dark:border-gray-700': variant === 'secondary',
      'hover:bg-gray-50': variant === 'secondary',
      'dark:hover:bg-gray-700': variant === 'secondary',
      'focus:ring-blue-500': variant === 'secondary',
      'dark:focus:ring-blue-500': variant === 'secondary'
    },
    {
      // Success variant
      'text-white': variant === 'success',
      'bg-green-600': variant === 'success',
      'hover:bg-green-700': variant === 'success',
      'dark:bg-green-700': variant === 'success',
      'dark:hover:bg-green-600': variant === 'success',
      'focus:ring-green-600': variant === 'success',
      'dark:focus:ring-green-700': variant === 'success'
    },
    {
      // Danger variant
      'text-white': variant === 'danger',
      'bg-red-600': variant === 'danger',
      'hover:bg-red-700': variant === 'danger',
      'dark:bg-red-700': variant === 'danger',
      'dark:hover:bg-red-600': variant === 'danger',
      'focus:ring-red-500': variant === 'danger',
      'dark:focus:ring-red-700': variant === 'danger'
    },
    {
      // Sizes
      'px-3': size === 'sm',
      'py-1.5': size === 'sm',
      'text-xs': size === 'sm',
      'px-4': size === 'md',
      'py-2': size === 'md',
      'text-sm': size === 'md',
      'px-6': size === 'lg',
      'py-3': size === 'lg',
      'text-base': size === 'lg'
    },
    className
  );

  return (
    <Component className={classes} {...props}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Component>
  );
};
