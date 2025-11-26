import c from 'classnames';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card = ({ children, className, noPadding }: CardProps) => {
  return (
    <div
      className={c([
        'bg-white',
        'dark:bg-gray-900',
        'rounded-lg',
        'shadow',
        'border',
        'border-gray-200',
        'dark:border-gray-700',
        !noPadding && 'p-6',
        className
      ])}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export const CardHeader = ({ title, subtitle, actions, icon, className }: CardHeaderProps) => {
  return (
    <div className={c(['flex', 'items-center', 'justify-between', className])}>
      <div className="flex items-center">
        {icon && <span className="mr-3">{icon}</span>}
        <div>
          {typeof title === 'string' ? (
            <h3 className={c(['text-lg', 'font-medium', 'text-gray-900', 'dark:text-gray-100'])}>
              {title}
            </h3>
          ) : (
            title
          )}
          {subtitle && (
            <div className={c(['text-sm', 'text-gray-600', 'dark:text-gray-400', 'mt-1'])}>
              {subtitle}
            </div>
          )}
        </div>
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
};

interface CardSectionProps {
  children: ReactNode;
  className?: string;
}

export const CardSection = ({ children, className }: CardSectionProps) => {
  return (
    <div
      className={c([
        'border-t',
        'border-gray-200',
        'dark:border-gray-700',
        'first:border-t-0',
        'p-6',
        className
      ])}
    >
      {children}
    </div>
  );
};
