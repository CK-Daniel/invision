import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getStaticUrl(url: string): string {
  if (!url) return '';
  
  // If the URL already starts with http or https, return it as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // For avatars that start with /common
  if (url.startsWith('/common')) {
    return `/static${url}`;
  }

  // For project thumbnails that start with /projects
  if (url.startsWith('/projects')) {
    return `/static${url}`;
  }

  // For any other static files
  return `/static${url}`;
}

export function getInitials(name: string): string {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
}

export function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text).catch(err => {
    console.error('Failed to copy text to clipboard:', err);
  });
}

export async function copyImageToClipboard(url: string): Promise<void> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob
      })
    ]);
  } catch (err) {
    console.error('Failed to copy image to clipboard:', err);
  }
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function isSystemAvatar(avatarId: string): boolean {
  return avatarId?.startsWith('00000000-0000-0000-0000');
}
