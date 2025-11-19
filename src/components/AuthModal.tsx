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
        'bg-opacity-50',
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
          'w-96',
          'shadow-lg',
          'rounded-md',
          'bg-white'
        ])}
      >
        <div className={c(['flex', 'items-center', 'justify-between', 'mb-4'])}>
          <h3 className={c(['text-lg', 'font-medium', 'text-gray-900'])}>GitHub Authentication</h3>
          <button onClick={onClose} className={c(['text-gray-400', 'hover:text-gray-600'])}>
            <FaTimes />
          </button>
        </div>

        <div className={c(['mb-4'])}>
          <p className={c(['text-sm', 'text-gray-600', 'mb-2'])}>
            To increase the API rate limit from 60 to 5,000 requests per hour, please provide a
            GitHub Personal Access Token.
          </p>
          <div className={c(['bg-blue-50', 'p-3', 'rounded', 'text-sm', 'text-blue-800'])}>
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
              className={c(['block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-2'])}
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
                <FaKey className={c(['h-4', 'w-4', 'text-gray-400'])} />
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
                  'rounded-md',
                  'text-sm',
                  'placeholder-gray-500',
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
                'bg-gray-100',
                'border',
                'border-gray-300',
                'rounded-md',
                'hover:bg-gray-200',
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

        <div className={c(['mt-4', 'pt-4', 'border-t', 'border-gray-200'])}>
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className={c([
              'inline-flex',
              'items-center',
              'text-sm',
              'text-blue-600',
              'hover:text-blue-800'
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
