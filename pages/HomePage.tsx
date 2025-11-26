import c from 'classnames';
import { useState } from 'react';
import { FaGithub, FaRocket } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '~/components/Button';
import { Input } from '~/components/Input';

export const HomePage = () => {
  const [repoUrl, setRepoUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Extract owner/repo from various GitHub URL formats
    const patterns = [/github\.com\/([^/]+)\/([^/]+)/, /^([^/]+)\/([^/]+)$/];

    for (const pattern of patterns) {
      const match = repoUrl.match(pattern);
      if (match) {
        const [, owner, repo] = match;
        if (owner && repo) {
          navigate(`/${owner}/${repo.replace('.git', '')}`);
          return;
        }
      }
    }

    // If no pattern matches, treat as direct owner/repo
    alert('Please enter a valid GitHub repository URL or owner/repo format');
  };

  return (
    <div className={c(['min-h-screen', 'flex', 'flex-col', 'bg-gray-50', 'dark:bg-gray-900'])}>
      {/* Header */}
      <header
        className={c([
          'bg-white',
          'dark:bg-gray-900',
          'border-b',
          'border-gray-200',
          'dark:border-gray-700'
        ])}
      >
        <div className={c(['max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-6'])}>
          <div className={c(['flex', 'items-center'])}>
            <img src="/logo.svg" alt="GetHub.cc Logo" className={c(['w-8', 'h-8', 'mr-3'])} />
            <h1 className={c(['text-2xl', 'font-bold', 'text-gray-900', 'dark:text-gray-100'])}>
              GetHub.cc
            </h1>
          </div>
          <p className={c(['text-gray-600', 'dark:text-gray-400', 'mt-2'])}>
            Streamlined downloads for GitHub releases
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main
        className={c([
          'flex-1',
          'flex',
          'items-center',
          'justify-center',
          'px-4',
          'sm:px-6',
          'lg:px-8'
        ])}
      >
        <div className={c(['max-w-md', 'w-full', 'space-y-8'])}>
          <div className={c(['text-center'])}>
            <FaRocket
              className={c(['mx-auto', 'h-16', 'w-16', 'text-blue-600', 'dark:text-blue-500'])}
            />
            <h2
              className={c([
                'mt-6',
                'text-3xl',
                'font-extrabold',
                'text-gray-900',
                'dark:text-gray-100'
              ])}
            >
              Find Downloads Fast
            </h2>
            <p className={c(['mt-2', 'text-sm', 'text-gray-600', 'dark:text-gray-400'])}>
              Enter a GitHub repository to get optimized download links
            </p>
          </div>

          <form className={c(['mt-8', 'space-y-6'])} onSubmit={handleSubmit}>
            <div>
              <label htmlFor="repo-url" className={c(['sr-only'])}>
                Repository URL or owner/repo
              </label>
              <Input
                id="repo-url"
                name="repo-url"
                type="text"
                required
                icon={<FaGithub className="h-5 w-5" />}
                placeholder="GitHub repository URL"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="py-3"
              />
            </div>

            <div>
              <Button type="submit" variant="success" size="lg" className="w-full">
                Get Downloads
              </Button>
            </div>
          </form>

          {/* Examples */}
          <div className={c(['text-center', 'space-y-2'])}>
            <p className={c(['text-xs', 'text-gray-600', 'dark:text-gray-400', 'font-medium'])}>
              Examples:
            </p>
            <div className={c(['flex', 'flex-wrap', 'justify-center', 'gap-3', 'text-xs'])}>
              <Link
                to="/tyrrrz/discordchatexporter"
                className={c([
                  'text-blue-600',
                  'dark:text-blue-400',
                  'hover:text-blue-700',
                  'dark:hover:text-blue-300',
                  'underline',
                  'decoration-dotted',
                  'underline-offset-2',
                  'cursor-pointer'
                ])}
              >
                tyrrrz/discordchatexporter
              </Link>
              <span className={c(['text-gray-300', 'dark:text-gray-700'])}>•</span>
              <Link
                to="/obsidianmd/obsidian-releases"
                className={c([
                  'text-blue-600',
                  'dark:text-blue-400',
                  'hover:text-blue-700',
                  'dark:hover:text-blue-300',
                  'underline',
                  'decoration-dotted',
                  'underline-offset-2',
                  'cursor-pointer'
                ])}
              >
                obsidianmd/obsidian-releases
              </Link>
              <span className={c(['text-gray-300', 'dark:text-gray-700'])}>•</span>
              <Link
                to="/electron/electron"
                className={c([
                  'text-blue-600',
                  'dark:text-blue-400',
                  'hover:text-blue-700',
                  'dark:hover:text-blue-300',
                  'underline',
                  'decoration-dotted',
                  'underline-offset-2',
                  'cursor-pointer'
                ])}
              >
                electron/electron
              </Link>
              <span className={c(['text-gray-300', 'dark:text-gray-700'])}>•</span>
              <Link
                to="/vscode-icons/vscode-icons"
                className={c([
                  'text-blue-600',
                  'dark:text-blue-400',
                  'hover:text-blue-700',
                  'dark:hover:text-blue-300',
                  'underline',
                  'decoration-dotted',
                  'underline-offset-2',
                  'cursor-pointer'
                ])}
              >
                vscode-icons/vscode-icons
              </Link>
              <span className={c(['text-gray-300', 'dark:text-gray-700'])}>•</span>
              <Link
                to="/aristocratos/btop"
                className={c([
                  'text-blue-600',
                  'dark:text-blue-400',
                  'hover:text-blue-700',
                  'dark:hover:text-blue-300',
                  'underline',
                  'decoration-dotted',
                  'underline-offset-2',
                  'cursor-pointer'
                ])}
              >
                aristocratos/btop
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className={c([
          'bg-white',
          'dark:bg-gray-900',
          'border-t',
          'border-gray-200',
          'dark:border-gray-700'
        ])}
      >
        <div className={c(['max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-6'])}>
          <p className={c(['text-center', 'text-sm', 'text-gray-600', 'dark:text-gray-400'])}>
            Powered by GitHub API • Built for developers
          </p>
        </div>
      </footer>
    </div>
  );
};
