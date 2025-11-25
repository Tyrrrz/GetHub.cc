import { AuthModal } from '@/components/AuthModal';
import { ReleaseList } from '@/components/ReleaseList';
import type { GitHubRelease } from '@/utils/github';
import { GitHubAPI } from '@/utils/github';
import type { Manifest } from '@/utils/manifest';
import { detectPlatform } from '@/utils/platform';
import c from 'classnames';
import { useEffect, useState } from 'react';
import { FaExclamationTriangle, FaGithub, FaHome, FaSpinner } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';

export const RepositoryPage = () => {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [githubToken, setGithubToken] = useState<string | null>(null);

  const userPlatform = detectPlatform();

  useEffect(() => {
    if (!owner || !repo) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const api = new GitHubAPI(githubToken || undefined);

        // Fetch releases and manifest in parallel
        const [releasesData, manifestData] = await Promise.all([
          api.getReleases(owner, repo),
          api.getManifest(owner, repo)
        ]);

        setReleases(releasesData);
        setManifest(manifestData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';

        if (errorMessage.includes('rate limit')) {
          setError('GitHub API rate limit exceeded. Please authenticate to continue.');
          setShowAuthModal(true);
        } else if (errorMessage.includes('Not Found')) {
          setError('Repository not found. Please check the owner and repository name.');
        } else {
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [owner, repo, githubToken]);

  const handleAuthentication = (token: string) => {
    setGithubToken(token);
    setShowAuthModal(false);
  };

  if (loading) {
    return (
      <div
        className={c([
          'min-h-screen',
          'flex',
          'items-center',
          'justify-center',
          'bg-gray-50',
          'dark:bg-gray-900'
        ])}
      >
        <div className={c(['text-center'])}>
          <FaSpinner
            className={c([
              'animate-spin',
              'h-8',
              'w-8',
              'text-blue-600',
              'dark:text-blue-400',
              'mx-auto',
              'mb-4'
            ])}
          />
          <p className={c(['text-gray-600', 'dark:text-gray-300'])}>Loading repository data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={c([
          'min-h-screen',
          'flex',
          'items-center',
          'justify-center',
          'px-4',
          'bg-gray-50',
          'dark:bg-gray-900'
        ])}
      >
        <div className={c(['text-center', 'max-w-md'])}>
          <FaExclamationTriangle
            className={c(['h-16', 'w-16', 'text-red-500', 'dark:text-red-400', 'mx-auto', 'mb-4'])}
          />
          <h2 className={c(['text-2xl', 'font-bold', 'text-gray-900', 'dark:text-white', 'mb-2'])}>
            Error
          </h2>
          <p className={c(['text-gray-600', 'dark:text-gray-300', 'mb-6'])}>{error}</p>
          <div className={c(['space-x-4'])}>
            <Link
              to="/"
              className={c([
                'inline-flex',
                'items-center',
                'px-4',
                'py-2',
                'border',
                'border-gray-300',
                'dark:border-gray-600',
                'rounded-md',
                'text-sm',
                'font-medium',
                'text-gray-700',
                'dark:text-gray-200',
                'bg-white',
                'dark:bg-gray-700',
                'hover:bg-gray-50',
                'dark:hover:bg-gray-600'
              ])}
            >
              <FaHome className={c(['mr-2'])} />
              Go Home
            </Link>
            {error.includes('rate limit') && (
              <button
                onClick={() => setShowAuthModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Authenticate
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-6"
              >
                <img src="/logo.svg" alt="GetHub.cc Logo" className="w-6 h-6 mr-2" />
                <span className="text-xl font-bold">GetHub.cc</span>
              </Link>
              <div className="flex items-center">
                <FaGithub className="text-gray-600 dark:text-gray-300 text-xl mr-3" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {owner}/{repo}
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {!manifest && (
                <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded">
                  No gethub.json found
                </div>
              )}
              <a
                href={`https://github.com/${owner}/${repo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <FaGithub className="mr-2" />
                View on GitHub
              </a>
            </div>
          </div>

          {userPlatform.os && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Detected platform: {userPlatform.os} {userPlatform.arch}
            </p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {releases.length > 0 ? (
          <ReleaseList releases={releases} manifest={manifest} userPlatform={userPlatform} />
        ) : (
          <div className="text-center py-12">
            <FaExclamationTriangle className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No releases found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              This repository doesn't have any releases yet.
            </p>
          </div>
        )}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onAuthenticate={handleAuthentication} onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
};
