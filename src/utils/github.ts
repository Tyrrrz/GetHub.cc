import { Octokit } from '@octokit/rest';
import type { Manifest } from './manifest';

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  assets: GitHubAsset[];
  prerelease: boolean;
  draft: boolean;
}

export interface GitHubAsset {
  id: number;
  name: string;
  size: number;
  download_count: number;
  browser_download_url: string;
  content_type: string;
}

export class GitHubAPI {
  private octokit: Octokit;

  constructor(token?: string) {
    this.octokit = new Octokit({
      auth: token,
      userAgent: 'GetHub.cc'
    });
  }

  async getReleases(owner: string, repo: string): Promise<GitHubRelease[]> {
    try {
      const { data } = await this.octokit.rest.repos.listReleases({
        owner,
        repo,
        per_page: 100
      });

      return data.map((release) => ({
        id: release.id,
        tag_name: release.tag_name,
        name: release.name || release.tag_name,
        body: release.body || '',
        published_at: release.published_at || '',
        prerelease: release.prerelease,
        draft: release.draft,
        assets: release.assets.map((asset) => ({
          id: asset.id,
          name: asset.name,
          size: asset.size,
          download_count: asset.download_count,
          browser_download_url: asset.browser_download_url,
          content_type: asset.content_type || ''
        }))
      }));
    } catch (error) {
      console.error('Failed to fetch releases:', error);
      throw new Error('Failed to fetch releases from GitHub API');
    }
  }

  async getManifest(owner: string, repo: string): Promise<Manifest | null> {
    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path: 'gethub.json'
      });

      if ('content' in data && data.content) {
        const content = atob(data.content.replace(/\\s/g, ''));
        const manifest: Manifest = JSON.parse(content);
        return manifest;
      }

      return null;
    } catch (error) {
      console.error('Failed to fetch manifest:', error);
      return null;
    }
  }

  async getRateLimit() {
    try {
      const { data } = await this.octokit.rest.rateLimit.get();
      return data.rate;
    } catch (error) {
      console.error('Failed to get rate limit:', error);
      return null;
    }
  }
}
