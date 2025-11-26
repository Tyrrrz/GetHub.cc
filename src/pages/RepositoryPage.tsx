import { AuthModal } from '@/components/AuthModal';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardSection } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { Select } from '@/components/Select';
import { formatDate, formatFileSize, formatNumber } from '@/utils/formatting';
import type { GitHubAsset, GitHubRelease } from '@/utils/github';
import { GitHubAPI } from '@/utils/github';
import type { Architecture, Manifest, OS } from '@/utils/manifest';
import { detectAssetPlatform, matchAsset } from '@/utils/manifest';
import { detectPlatform, formatArchitecture, formatOS } from '@/utils/platform';
import c from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import {
  FaCalendarAlt,
  FaDownload,
  FaExclamationTriangle,
  FaFilter,
  FaGithub,
  FaHome,
  FaSpinner,
  FaTag
} from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';

interface EnrichedAsset extends GitHubAsset {
  isRecommended?: boolean;
  os?: OS;
  arch?: Architecture;
  tags?: string[];
  description?: string;
}

export const RepositoryPage = () => {
  const { owner, repo } = useParams<{ owner: string; repo: string }>();
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [githubToken, setGithubToken] = useState<string | null>(null);

  const userPlatform = detectPlatform();

  // Release list filters
  const [selectedVersion, setSelectedVersion] = useState<string>('latest');
  const [osFilter, setOsFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');

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

  // Enrich assets with manifest information or automatic detection
  const enrichedReleases = useMemo(() => {
    return releases.map((release) => ({
      ...release,
      assets: release.assets.map((asset) => {
        const enrichedAsset: EnrichedAsset = { ...asset };

        if (manifest) {
          // Find matching rule from manifest
          const matchedRule = manifest.rules.find((rule) => matchAsset(asset.name, rule));
          if (matchedRule) {
            enrichedAsset.os = matchedRule.os;
            enrichedAsset.arch = matchedRule.arch;
            enrichedAsset.tags = matchedRule.tags || [];
            enrichedAsset.description = matchedRule.description;
          }
        } else {
          // Automatic platform detection when no manifest
          const detected = detectAssetPlatform(asset.name);
          if (detected.os || detected.arch || detected.tags) {
            enrichedAsset.os = detected.os;
            enrichedAsset.arch = detected.arch;
            enrichedAsset.tags = detected.tags || [];
          }
        }

        return enrichedAsset;
      })
    }));
  }, [releases, manifest]);

  // Apply recommendation logic separately after enrichment
  const releasesWithRecommendations = useMemo(() => {
    return enrichedReleases.map((release) => {
      // First pass: find exact OS+arch matches
      let hasExactMatch = false;
      const assetsWithRecommendations = release.assets.map((asset) => {
        const isExactMatch =
          userPlatform.os &&
          userPlatform.arch &&
          asset.os === userPlatform.os &&
          asset.arch === userPlatform.arch;

        if (isExactMatch) {
          hasExactMatch = true;
        }

        return { ...asset, isRecommended: isExactMatch };
      });

      // Second pass: if no exact match, recommend OS-only matches
      if (!hasExactMatch && userPlatform.os) {
        return {
          ...release,
          assets: assetsWithRecommendations.map((asset) => {
            const isOSMatch = asset.os === userPlatform.os;
            return { ...asset, isRecommended: isOSMatch };
          })
        };
      }

      return { ...release, assets: assetsWithRecommendations };
    });
  }, [enrichedReleases, userPlatform]);

  // Get available filter options
  const availableVersions = useMemo(() => {
    return [
      { value: 'latest', label: 'Latest Release' },
      ...releases.slice(0, 10).map((release) => ({
        value: release.tag_name,
        label: release.name || release.tag_name
      }))
    ];
  }, [releases]);

  const availableOS = useMemo(() => {
    const osSet = new Set<string>();

    if (manifest) {
      // Get OS from manifest rules
      manifest.rules.forEach((rule) => {
        if (rule.os) osSet.add(rule.os);
      });
    } else {
      // Get OS from automatic detection
      enrichedReleases.forEach((release) => {
        release.assets.forEach((asset) => {
          if (asset.os) {
            osSet.add(asset.os);
          }
        });
      });
    }

    return Array.from(osSet).map((os) => ({
      value: os,
      label: formatOS(os as OS)
    }));
  }, [manifest, enrichedReleases]);

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();

    if (manifest) {
      // Get tags from manifest rules
      manifest.rules.forEach((rule) => {
        rule.tags?.forEach((tag) => tagSet.add(tag));
      });
    } else {
      // Get tags from automatic detection
      enrichedReleases.forEach((release) => {
        release.assets.forEach((asset) => {
          asset.tags?.forEach((tag) => tagSet.add(tag));
        });
      });
    }

    return Array.from(tagSet).map((tag) => ({
      value: tag,
      label: tag
    }));
  }, [manifest, enrichedReleases]);

  // Filter releases
  const filteredReleases = useMemo(() => {
    let filtered = releasesWithRecommendations;

    // Version filter
    if (selectedVersion === 'latest') {
      filtered = filtered.slice(0, 1);
    } else {
      filtered = filtered.filter((release) => release.tag_name === selectedVersion);
    }

    // Apply filters to assets and sort them
    return filtered
      .map((release) => ({
        ...release,
        assets: release.assets
          .filter((asset) => {
            // OS filter
            if (osFilter !== 'all') {
              if (asset.os !== osFilter) {
                return false;
              }
            }

            // Tag filter
            if (tagFilter !== 'all') {
              if (!asset.tags?.includes(tagFilter)) {
                return false;
              }
            }

            return true;
          })
          .sort((a, b) => {
            // Recommended assets first
            if (a.isRecommended && !b.isRecommended) return -1;
            if (!a.isRecommended && b.isRecommended) return 1;

            // Then group by OS
            const aOS = a.os || '';
            const bOS = b.os || '';
            if (aOS !== bOS) return aOS.localeCompare(bOS);

            // Then by architecture within same OS
            const aArch = a.arch || '';
            const bArch = b.arch || '';
            if (aArch !== bArch) return aArch.localeCompare(bArch);

            // Finally by name
            return a.name.localeCompare(b.name);
          })
      }))
      .filter((release) => release.assets.length > 0);
  }, [releasesWithRecommendations, selectedVersion, osFilter, tagFilter]);

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
              'dark:text-blue-500',
              'mx-auto',
              'mb-4'
            ])}
          />
          <p className={c(['text-gray-600', 'dark:text-gray-400'])}>Loading repository data...</p>
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
            className={c(['h-16', 'w-16', 'text-red-600', 'dark:text-red-500', 'mx-auto', 'mb-4'])}
          />
          <h2
            className={c(['text-2xl', 'font-bold', 'text-gray-900', 'dark:text-gray-100', 'mb-2'])}
          >
            Error
          </h2>
          <p className={c(['text-gray-600', 'dark:text-gray-400', 'mb-6'])}>{error}</p>
          <div className={c(['space-x-4'])}>
            <Button as={Link} to="/" variant="secondary" icon={<FaHome />}>
              Go Home
            </Button>
            {error.includes('rate limit') && (
              <Button onClick={() => setShowAuthModal(true)} variant="success">
                Authenticate
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mr-6"
              >
                <img src="/logo.svg" alt="GetHub.cc Logo" className="w-6 h-6 mr-2" />
                <span className="text-xl font-bold">GetHub.cc</span>
              </Link>
              <div className="flex items-center">
                <FaGithub className="text-gray-600 dark:text-gray-400 text-xl mr-3" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {owner}/{repo}
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {!manifest && (
                <div className="text-sm text-yellow-700 dark:text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded border border-yellow-200 dark:border-yellow-700">
                  No gethub.json found
                </div>
              )}
              <Button
                as="a"
                href={`https://github.com/${owner}/${repo}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                icon={<FaGithub />}
              >
                View on GitHub
              </Button>
            </div>
          </div>

          {userPlatform.os && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Detected platform: {userPlatform.os} {userPlatform.arch}
            </p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {releases.length > 0 ? (
          <div className={c(['space-y-6'])}>
            {/* Filters */}
            <Card>
              <CardHeader icon={<FaFilter />} title="Filters" />

              <div className={c(['grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-4', 'mt-4'])}>
                {/* Version Filter */}
                <Select
                  label="Version"
                  value={selectedVersion}
                  onChange={(e) => setSelectedVersion(e.target.value)}
                  options={availableVersions}
                />

                {/* OS Filter */}
                {availableOS.length > 0 && (
                  <Select
                    label="Operating System"
                    value={osFilter}
                    onChange={(e) => setOsFilter(e.target.value)}
                    options={[{ value: 'all', label: 'All Platforms' }, ...availableOS]}
                  />
                )}

                {/* Tag Filter */}
                {availableTags.length > 0 && (
                  <Select
                    label="Type"
                    value={tagFilter}
                    onChange={(e) => setTagFilter(e.target.value)}
                    options={[{ value: 'all', label: 'All Types' }, ...availableTags]}
                  />
                )}
              </div>
            </Card>

            {/* Releases */}
            {filteredReleases.map((release) => (
              <Card key={release.id} noPadding>
                {/* Release Header */}
                <CardSection>
                  <CardHeader
                    icon={<FaTag className="text-blue-600 dark:text-blue-500" />}
                    title={
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        {release.name}
                      </h2>
                    }
                    subtitle={
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-1" />
                        {formatDate(release.published_at)}
                        {release.prerelease && (
                          <Badge variant="warning" size="md" className="ml-3">
                            Pre-release
                          </Badge>
                        )}
                      </div>
                    }
                    actions={
                      <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                        {release.assets.length} asset{release.assets.length !== 1 ? 's' : ''}
                      </div>
                    }
                  />
                </CardSection>

                {/* Assets */}
                <CardSection>
                  <div className="grid gap-4">
                    {release.assets.map((asset) => (
                      <div
                        key={asset.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          asset.isRecommended
                            ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        } transition-colors`}
                      >
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mr-3">
                              {asset.name}
                            </h4>
                            {asset.isRecommended && (
                              <Badge variant="primary" size="md">
                                Recommended
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <span>{formatFileSize(asset.size)}</span>
                            <span>•</span>
                            <span>{formatNumber(asset.download_count)} downloads</span>

                            {/* Display platform info from manifest or detection */}
                            {(asset.os || asset.arch) && (
                              <>
                                <span>•</span>
                                {asset.os && (
                                  <Badge variant="primary" outlined>
                                    {formatOS(asset.os)}
                                  </Badge>
                                )}
                                {asset.arch && (
                                  <Badge variant="primary" outlined>
                                    {formatArchitecture(asset.arch)}
                                  </Badge>
                                )}
                              </>
                            )}

                            {/* Display tags from manifest or detection */}
                            {asset.tags && asset.tags.length > 0 && (
                              <>
                                {asset.tags.map((tag) => (
                                  <Badge key={tag} variant="default">
                                    {tag}
                                  </Badge>
                                ))}
                              </>
                            )}
                          </div>

                          {asset.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {asset.description}
                            </p>
                          )}

                          {asset.digest && (
                            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 font-mono break-all">
                              {asset.digest}
                            </div>
                          )}
                        </div>

                        <Button
                          as="a"
                          href={asset.browser_download_url}
                          variant="success"
                          icon={<FaDownload />}
                          className="ml-4"
                        >
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardSection>
              </Card>
            ))}

            {filteredReleases.length === 0 && (
              <EmptyState
                icon={<FaDownload className="h-16 w-16" />}
                title="No assets found"
                description="Try adjusting your filters to see more results."
              />
            )}
          </div>
        ) : (
          <EmptyState
            icon={<FaExclamationTriangle className="h-16 w-16" />}
            title="No releases found"
            description="This repository doesn't have any releases yet."
          />
        )}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onAuthenticate={handleAuthentication} onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
};
