import c from 'classnames';
import { useState } from 'react';
import { FaGithub, FaKey, FaTimes } from 'react-icons/fa';

interface AuthModalProps {
  onAuthenticate: (token: string) => void;
  onClose: () => void;
}

export const AuthModal = ({ onAuthenticate, onClose }: AuthModalProps) => {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onAuthenticate(token.trim());
    }
  };

  return (
    <div
      className={c([
        'fixed',
        'inset-0',
        'bg-gray-600',
        'dark:bg-gray-900',
        'bg-opacity-50',
        'dark:bg-opacity-75',
        'overflow-y-auto',
        'h-full',
        'w-full',
        'z-50'
      ])}
    >
      <div
        className={c([
          'relative',
          'top-20',
          'mx-auto',
          'p-5',
          'border',
          'border-gray-200',
          'dark:border-gray-700',
          'w-96',
          'shadow-lg',
          'rounded-md',
          'bg-white',
          'dark:bg-gray-800'
        ])}
      >
        <div className={c(['flex', 'items-center', 'justify-between', 'mb-4'])}>
          <h3 className={c(['text-lg', 'font-medium', 'text-gray-900', 'dark:text-white'])}>
            GitHub Authentication
          </h3>
          <button
            onClick={onClose}
            className={c(['text-gray-400', 'hover:text-gray-600', 'dark:hover:text-gray-300'])}
          >
            <FaTimes />
          </button>
        </div>

        <div className={c(['mb-4'])}>
          <p className={c(['text-sm', 'text-gray-600', 'dark:text-gray-300', 'mb-2'])}>
            To increase the API rate limit from 60 to 5,000 requests per hour, please provide a
            GitHub Personal Access Token.
          </p>
          <div
            className={c([
              'bg-blue-50',
              'dark:bg-blue-900/30',
              'p-3',
              'rounded',
              'text-sm',
              'text-blue-800',
              'dark:text-blue-300'
            ])}
          >
            <strong>How to create a token:</strong>
            <ol className={c(['list-decimal', 'list-inside', 'mt-2', 'space-y-1'])}>
              <li>Go to GitHub Settings → Developer settings</li>
              <li>Click "Personal access tokens" → "Tokens (classic)"</li>
              <li>Generate new token (no special scopes needed for public repos)</li>
              <li>Copy and paste the token below</li>
            </ol>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={c(['mb-4'])}>
            <label
              htmlFor="github-token"
              className={c([
                'block',
                'text-sm',
                'font-medium',
                'text-gray-700',
                'dark:text-gray-300',
                'mb-2'
              ])}
            >
              Personal Access Token
            </label>
            <div className={c(['relative'])}>
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
                <FaKey className={c(['h-4', 'w-4', 'text-gray-400', 'dark:text-gray-500'])} />
              </div>
              <input
                id="github-token"
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className={c([
                  'block',
                  'w-full',
                  'pl-10',
                  'pr-3',
                  'py-2',
                  'border',
                  'border-gray-300',
                  'dark:border-gray-600',
                  'rounded-md',
                  'text-sm',
                  'bg-white',
                  'dark:bg-gray-700',
                  'text-gray-900',
                  'dark:text-white',
                  'placeholder-gray-500',
                  'dark:placeholder-gray-400',
                  'focus:outline-none',
                  'focus:ring-blue-500',
                  'focus:border-blue-500'
                ])}
              />
            </div>
          </div>

          <div className={c(['flex', 'justify-end', 'space-x-3'])}>
            <button
              type="button"
              onClick={onClose}
              className={c([
                'px-4',
                'py-2',
                'text-sm',
                'font-medium',
                'text-gray-700',
                'dark:text-gray-200',
                'bg-gray-100',
                'dark:bg-gray-700',
                'border',
                'border-gray-300',
                'dark:border-gray-600',
                'rounded-md',
                'hover:bg-gray-200',
                'dark:hover:bg-gray-600',
                'focus:outline-none',
                'focus:ring-2',
                'focus:ring-gray-500'
              ])}
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={!token.trim()}
              className={c([
                'px-4',
                'py-2',
                'text-sm',
                'font-medium',
                'text-white',
                'bg-blue-600',
                'border',
                'border-transparent',
                'rounded-md',
                'hover:bg-blue-700',
                'focus:outline-none',
                'focus:ring-2',
                'focus:ring-blue-500',
                'disabled:opacity-50',
                'disabled:cursor-not-allowed'
              ])}
            >
              Authenticate
            </button>
          </div>
        </form>

        <div className={c(['mt-4', 'pt-4', 'border-t', 'border-gray-200', 'dark:border-gray-700'])}>
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className={c([
              'inline-flex',
              'items-center',
              'text-sm',
              'text-blue-600',
              'dark:text-blue-400',
              'hover:text-blue-800',
              'dark:hover:text-blue-300'
            ])}
          >
            <FaGithub className={c(['mr-1'])} />
            Create token on GitHub
          </a>
        </div>
      </div>
    </div>
  );
};
