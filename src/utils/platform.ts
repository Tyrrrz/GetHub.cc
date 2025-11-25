import type { Architecture, OS } from './manifest';

export interface PlatformInfo {
  os: OS | null;
  arch: Architecture | null;
}

export const detectPlatform = (): PlatformInfo => {
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();

  // Detect OS
  let os: OS | null = null;
  if (userAgent.includes('win') || platform.includes('win')) {
    os = 'windows';
  } else if (userAgent.includes('mac') || platform.includes('mac')) {
    os = 'osx';
  } else if (userAgent.includes('linux') || platform.includes('linux')) {
    os = 'linux';
  }

  // Detect Architecture
  let arch: Architecture | null = null;
  if (
    userAgent.includes('wow64') ||
    userAgent.includes('x64') ||
    userAgent.includes('x86_64') ||
    userAgent.includes('amd64')
  ) {
    arch = 'x64';
  } else if (userAgent.includes('arm64') || userAgent.includes('aarch64')) {
    arch = 'arm64';
  } else if (userAgent.includes('arm')) {
    arch = 'arm';
  } else if (
    userAgent.includes('x86') ||
    userAgent.includes('i386') ||
    userAgent.includes('i686')
  ) {
    arch = 'x86';
  } else {
    // Default assumption for modern systems
    arch = 'x64';
  }

  return { os, arch };
};

export const formatPlatform = (os?: OS, arch?: Architecture): string => {
  if (!os && !arch) return 'Any platform';

  const osNames: Record<OS, string> = {
    windows: 'Windows',
    linux: 'Linux',
    osx: 'macOS'
  };

  const archNames: Record<Architecture, string> = {
    x86: 'x86',
    x64: 'x64',
    arm: 'ARM',
    arm64: 'ARM64'
  };

  const osName = os ? osNames[os] : '';
  const archName = arch ? archNames[arch] : '';

  return [osName, archName].filter(Boolean).join(' ');
};
