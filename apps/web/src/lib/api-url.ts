/**
 * Dynamically resolves the API base URL.
 * - When running in the browser on another device (e.g. phone via Wi-Fi IP),
 *   it automatically uses that device's connection hostname (e.g. http://192.168.0.181:4000/api/v1).
 * - When NEXT_PUBLIC_API_URL is configured, that takes priority.
 * - During server-side rendering, it falls back to http://localhost:4000/api/v1.
 */
export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  if (typeof window !== 'undefined' && window.location?.hostname) {
    const protocol = window.location.protocol || 'http:';
    const hostname = window.location.hostname;
    return `${protocol}//${hostname}:4000/api/v1`;
  }

  return 'http://localhost:4000/api/v1';
}
