import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
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
        'bg-gray-900',
        'dark:bg-black',
        'bg-opacity-50',
        'dark:bg-opacity-75',
        'overflow-y-auto',
        'h-full',
        'w-full',
        'z-50'
      ])}
    >
      <Card className="relative top-20 mx-auto w-96">
        <div className={c(['flex', 'items-center', 'justify-between', 'mb-4'])}>
          <h3 className={c(['text-lg', 'font-medium', 'text-gray-900', 'dark:text-gray-100'])}>
            GitHub Authentication
          </h3>
          <button
            onClick={onClose}
            className={c([
              'text-gray-600',
              'hover:text-gray-900',
              'dark:text-gray-400',
              'dark:hover:text-gray-100'
            ])}
          >
            <FaTimes />
          </button>
        </div>

        <div className={c(['mb-4'])}>
          <p className={c(['text-sm', 'text-gray-600', 'dark:text-gray-400', 'mb-2'])}>
            To increase the API rate limit from 60 to 5,000 requests per hour, please provide a
            GitHub Personal Access Token.
          </p>
          <div
            className={c([
              'bg-blue-50',
              'dark:bg-blue-900/20',
              'p-3',
              'rounded',
              'text-sm',
              'text-blue-700',
              'dark:text-blue-400',
              'border',
              'border-blue-200',
              'dark:border-blue-800'
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
          <Input
            id="github-token"
            type="password"
            label="Personal Access Token"
            icon={<FaKey className="h-4 w-4" />}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />

          <div className={c(['flex', 'justify-end', 'space-x-3', 'mt-4'])}>
            <Button type="button" onClick={onClose} variant="secondary">
              Skip
            </Button>
            <Button type="submit" variant="success" disabled={!token.trim()}>
              Authenticate
            </Button>
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
              'hover:text-blue-700',
              'dark:hover:text-blue-300'
            ])}
          >
            <FaGithub className={c(['mr-1'])} />
            Create token on GitHub
          </a>
        </div>
      </Card>
    </div>
  );
};
