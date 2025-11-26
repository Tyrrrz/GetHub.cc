import c from 'classnames';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState = ({ icon, title, description, action, className }: EmptyStateProps) => {
  return (
    <div className={c(['text-center', 'py-12', className])}>
      <div className={c(['text-gray-600', 'dark:text-gray-400', 'mx-auto', 'mb-4'])}>{icon}</div>
      <h3 className={c(['text-lg', 'font-medium', 'text-gray-900', 'dark:text-gray-100', 'mb-2'])}>
        {title}
      </h3>
      {description && (
        <p className={c(['text-gray-600', 'dark:text-gray-400', 'mb-6'])}>{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};
