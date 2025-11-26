/*
Example gethub.json manifest:

{
  "version": 1,
  "rules": [
    {
      "asset": "DiscordChatExporter\\.Cli\\.win-x64\\.zip",
      "os": "windows",
      "arch": "x64",
      "tags": ["cli"],
      "description": "CLI flavor of the app for Windows x64"
    },
    {
      "asset": "DiscordChatExporter\\.Cli\\.win-x86\\.zip",
      "os": "windows",
      "arch": "x86",
      "tags": ["cli"],
      "description": "CLI flavor of the app for Windows x86"
    },
    {
      "asset": "DiscordChatExporter\\.Cli\\.linux-x64\\.zip",
      "os": "linux",
      "arch": "x64",
      "tags": ["cli"],
      "description": "CLI flavor of the app for Linux x64"
    },
    {
      "asset": "DiscordChatExporter\\.win-x64\\.zip",
      "os": "windows",
      "arch": "x64",
      "tags": ["gui"],
      "description": "GUI flavor of the app for Windows x64"
    }
  ]
}
*/

export type OS = 'windows' | 'linux' | 'osx' | 'android';
export type Architecture = 'x86' | 'x64' | 'arm' | 'arm64';

export type Rule = {
  asset: string; // Regex pattern to match asset names
  os?: OS;
  arch?: Architecture;
  tags?: string[];
  description?: string;
};

export type Manifest = {
  version: number;
  rules: Rule[];
};

export const parseManifest = (json: string): Manifest => {
  const manifest: Manifest = JSON.parse(json);
  return manifest;
};

export const matchAsset = (assetName: string, rule: Rule): boolean => {
  try {
    const regex = new RegExp(rule.asset);
    return regex.test(assetName);
  } catch {
    // Fallback to exact string match if regex is invalid
    return assetName.includes(rule.asset);
  }
};

// Automatically detect platform information from asset filename
export const detectAssetPlatform = (
  assetName: string
): { os?: OS; arch?: Architecture; tags?: string[] } => {
  const lowerName = assetName.toLowerCase();
  let os: OS | undefined;
  let arch: Architecture | undefined;
  const tags: string[] = [];

  // Detect OS
  if (/\b(windows|win32|win64|win-x64|win-x86|win-arm64)\b|\.exe$/i.test(lowerName)) {
    os = 'windows';
  } else if (/\b(linux|ubuntu|debian|fedora|rhel|centos)\b|\.AppImage/i.test(lowerName)) {
    os = 'linux';
  } else if (/\b(macos|osx|darwin|mac)\b|mac-/i.test(lowerName)) {
    os = 'osx';
  } else if (/\bandroid\b|\.apk$/i.test(lowerName)) {
    os = 'android';
  }

  // Detect architecture
  if (/\b(x64|x86_64|amd64|win64)\b/i.test(lowerName)) {
    arch = 'x64';
  } else if (/\b(x86|win32|i386|i686)\b/i.test(lowerName)) {
    arch = 'x86';
  } else if (/\b(arm64|aarch64|apple-silicon)\b/i.test(lowerName)) {
    arch = 'arm64';
  } else if (/\b(arm|armv7|armhf)\b/i.test(lowerName)) {
    arch = 'arm';
  }

  // Detect common tags
  if (/\b(portable|standalone)\b/i.test(lowerName)) {
    tags.push('Portable');
  }
  if (/\b(installer|setup|msi)\b/i.test(lowerName)) {
    tags.push('Installer');
  }
  if (/\b(cli|console)\b/i.test(lowerName)) {
    tags.push('CLI');
  }
  if (/\b(gui|desktop)\b/i.test(lowerName)) {
    tags.push('GUI');
  }
  if (/\b(musl)\b/i.test(lowerName)) {
    tags.push('Musl');
  }

  return {
    os,
    arch,
    tags
  };
};
