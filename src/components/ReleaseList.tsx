import type { GitHubRelease } from '@/utils/github';
import type { Architecture, Manifest, OS, Rule } from '@/utils/manifest';
import { detectAssetPlatform, matchAsset } from '@/utils/manifest';
import type { PlatformInfo } from '@/utils/platform';
import { formatPlatform } from '@/utils/platform';
import c from 'classnames';
import { useMemo, useState } from 'react';
import { FaCalendarAlt, FaDownload, FaFilter, FaTag } from 'react-icons/fa';

interface ReleaseListProps {
  releases: GitHubRelease[];
  manifest: Manifest | null;
  userPlatform: PlatformInfo;
}

interface EnrichedAsset {
  id: number;
  name: string;
  size: number;
  download_count: number;
  browser_download_url: string;
  content_type: string;
  matchedRule?: Rule;
  detectedPlatform?: { os?: OS; arch?: Architecture; tags?: string[] };
  isRecommended?: boolean;
}

export const ReleaseList = ({ releases, manifest, userPlatform }: ReleaseListProps) => {
  const [selectedVersion, setSelectedVersion] = useState<string>('latest');
  const [osFilter, setOsFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');

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
            enrichedAsset.matchedRule = matchedRule;
          }
        } else {
          // Automatic platform detection when no manifest
          const detected = detectAssetPlatform(asset.name);
          if (detected.os || detected.arch || detected.tags) {
            enrichedAsset.detectedPlatform = detected;
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
        const assetOS = asset.matchedRule?.os || asset.detectedPlatform?.os;
        const assetArch = asset.matchedRule?.arch || asset.detectedPlatform?.arch;

        const isExactMatch =
          userPlatform.os &&
          userPlatform.arch &&
          assetOS === userPlatform.os &&
          assetArch === userPlatform.arch;

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
            const assetOS = asset.matchedRule?.os || asset.detectedPlatform?.os;
            const isOSMatch = assetOS === userPlatform.os;
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
          if (asset.detectedPlatform?.os) {
            osSet.add(asset.detectedPlatform.os);
          }
        });
      });
    }

    return Array.from(osSet).map((os) => ({
      value: os,
      label: formatPlatform(os as OS, undefined)
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
          asset.detectedPlatform?.tags?.forEach((tag) => tagSet.add(tag));
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
              const assetOS = asset.matchedRule?.os || asset.detectedPlatform?.os;
              if (assetOS !== osFilter) {
                return false;
              }
            }

            // Tag filter
            if (tagFilter !== 'all') {
              const assetTags = asset.matchedRule?.tags || asset.detectedPlatform?.tags || [];
              if (!assetTags.includes(tagFilter)) {
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
            const aOS = a.matchedRule?.os || a.detectedPlatform?.os || '';
            const bOS = b.matchedRule?.os || b.detectedPlatform?.os || '';
            if (aOS !== bOS) return aOS.localeCompare(bOS);

            // Then by architecture within same OS
            const aArch = a.matchedRule?.arch || a.detectedPlatform?.arch || '';
            const bArch = b.matchedRule?.arch || b.detectedPlatform?.arch || '';
            if (aArch !== bArch) return aArch.localeCompare(bArch);

            // Finally by name
            return a.name.localeCompare(b.name);
          })
      }))
      .filter((release) => release.assets.length > 0);
  }, [releasesWithRecommendations, selectedVersion, osFilter, tagFilter]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={c(['space-y-6'])}>
      {/* Filters */}
      <div className={c(['bg-white', 'dark:bg-gray-800', 'rounded-lg', 'shadow', 'p-6'])}>
        <div className={c(['flex', 'items-center', 'mb-4'])}>
          <FaFilter className={c(['text-gray-500', 'dark:text-gray-400', 'mr-2'])} />
          <h3 className={c(['text-lg', 'font-medium', 'text-gray-900', 'dark:text-white'])}>
            Filters
          </h3>
        </div>

        <div className={c(['grid', 'grid-cols-1', 'md:grid-cols-3', 'gap-4'])}>
          {/* Version Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Version
            </label>
            <select
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {availableVersions.map((version) => (
                <option key={version.value} value={version.value}>
                  {version.label}
                </option>
              ))}
            </select>
          </div>

          {/* OS Filter */}
          {availableOS.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Operating System
              </label>
              <select
                value={osFilter}
                onChange={(e) => setOsFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Platforms</option>
                {availableOS.map((os) => (
                  <option key={os.value} value={os.value}>
                    {os.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Tag Filter */}
          {availableTags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                {availableTags.map((tag) => (
                  <option key={tag.value} value={tag.value}>
                    {tag.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Releases */}
      {filteredReleases.map((release) => (
        <div key={release.id} className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {/* Release Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaTag className="text-blue-600 dark:text-blue-400 mr-3" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {release.name}
                  </h2>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                    <FaCalendarAlt className="mr-1" />
                    {formatDate(release.published_at)}
                    {release.prerelease && (
                      <span className="ml-3 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs rounded">
                        Pre-release
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                {release.assets.length} asset{release.assets.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Assets */}
          <div className="p-6">
            <div className="grid gap-4">
              {release.assets.map((asset) => (
                <div
                  key={asset.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    asset.isRecommended
                      ? 'border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  } transition-colors`}
                >
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="font-medium text-gray-900 dark:text-white mr-3">
                        {asset.name}
                      </h4>
                      {asset.isRecommended && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs rounded">
                          Recommended
                        </span>
                      )}
                    </div>

                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1 space-x-4">
                      {/* Display platform info from manifest or detection */}
                      {(asset.matchedRule || asset.detectedPlatform) && (
                        <>
                          {(asset.matchedRule?.os || asset.detectedPlatform?.os) && (
                            <span className="font-bold">
                              {formatPlatform(
                                (asset.matchedRule?.os || asset.detectedPlatform?.os)!,
                                asset.matchedRule?.arch || asset.detectedPlatform?.arch
                              )}
                            </span>
                          )}
                        </>
                      )}
                      <span>{formatFileSize(asset.size)}</span>
                      <span>{asset.download_count.toLocaleString()} downloads</span>
                      {/* Display tags from manifest or detection */}
                      {(asset.matchedRule || asset.detectedPlatform) && (
                        <>
                          {((asset.matchedRule?.tags && asset.matchedRule.tags.length > 0) ||
                            (asset.detectedPlatform?.tags &&
                              asset.detectedPlatform.tags.length > 0)) && (
                            <span className="flex items-center">
                              {(asset.matchedRule?.tags || asset.detectedPlatform?.tags || []).map(
                                (tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded mr-1"
                                  >
                                    {tag}
                                  </span>
                                )
                              )}
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    {asset.matchedRule?.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {asset.matchedRule.description}
                      </p>
                    )}
                  </div>

                  <a
                    href={asset.browser_download_url}
                    className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <FaDownload className="mr-2" />
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {filteredReleases.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <FaDownload className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No assets found
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Try adjusting your filters to see more results.
          </p>
        </div>
      )}
    </div>
  );
};
