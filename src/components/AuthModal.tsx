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
        'bg-slate-900',
        'dark:bg-slate-950',
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
          'border-slate-300',
          'dark:border-slate-700',
          'w-96',
          'shadow-lg',
          'rounded-md',
          'bg-white',
          'dark:bg-slate-900'
        ])}
      >
        <div className={c(['flex', 'items-center', 'justify-between', 'mb-4'])}>
          <h3 className={c(['text-lg', 'font-medium', 'text-slate-900', 'dark:text-slate-50'])}>
            GitHub Authentication
          </h3>
          <button
            onClick={onClose}
            className={c([
              'text-slate-600',
              'hover:text-slate-900',
              'dark:text-slate-400',
              'dark:hover:text-slate-50'
            ])}
          >
            <FaTimes />
          </button>
        </div>

        <div className={c(['mb-4'])}>
          <p className={c(['text-sm', 'text-slate-600', 'dark:text-slate-400', 'mb-2'])}>
            To increase the API rate limit from 60 to 5,000 requests per hour, please provide a
            GitHub Personal Access Token.
          </p>
          <div
            className={c([
              'bg-blue-50',
              'dark:bg-blue-900/10',
              'p-3',
              'rounded',
              'text-sm',
              'text-blue-600',
              'dark:text-blue-400'
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
                'text-slate-900',
                'dark:text-slate-50',
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
                <FaKey className={c(['h-4', 'w-4', 'text-slate-600', 'dark:text-slate-400'])} />
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
                  'border-slate-300',
                  'dark:border-slate-700',
                  'rounded-md',
                  'text-sm',
                  'bg-white',
                  'dark:bg-slate-950',
                  'text-slate-900',
                  'dark:text-slate-50',
                  'placeholder-slate-600',
                  'dark:placeholder-slate-500',
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
                'text-slate-900',
                'dark:text-slate-50',
                'bg-slate-50',
                'dark:bg-slate-800',
                'border',
                'border-slate-300',
                'dark:border-slate-700',
                'rounded-md',
                'hover:bg-slate-300',
                'dark:hover:bg-slate-700',
                'focus:outline-none',
                'focus:ring-2',
                'focus:ring-blue-500'
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
                'bg-green-600',
                'border',
                'border-transparent',
                'rounded-md',
                'hover:bg-green-700',
                'focus:outline-none',
                'focus:ring-2',
                'focus:ring-green-500',
                'disabled:opacity-50',
                'disabled:cursor-not-allowed'
              ])}
            >
              Authenticate
            </button>
          </div>
        </form>

        <div
          className={c(['mt-4', 'pt-4', 'border-t', 'border-slate-300', 'dark:border-slate-700'])}
        >
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
              'hover:text-blue-700',
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
