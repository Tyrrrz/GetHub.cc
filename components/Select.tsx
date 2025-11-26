import c from 'classnames';
import type { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  options: SelectOption[];
  label?: string;
}

export const Select = ({ options, label, className, ...props }: SelectProps) => {
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
      <select
        className={c([
          'block',
          'w-full',
          'px-3',
          'py-2',
          'border',
          'border-gray-300',
          'dark:border-gray-700',
          'rounded-md',
          'text-sm',
          'bg-white',
          'dark:bg-gray-800',
          'text-gray-900',
          'dark:text-gray-100',
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
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
