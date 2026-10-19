/**
 * Production Render API URL used as fallback when NEXT_PUBLIC_API_URL is not set.
 */
const PRODUCTION_API_URL = 'https://kobbys-intertech-services.onrender.com/api/v1';

/**
 * Dynamically resolves the API base URL.
 * - NEXT_PUBLIC_API_URL environment variable takes highest priority if set.
 * - In local browser development:
 *   - Localhost / loopback uses http://localhost:4000/api/v1.
 *   - LAN IP (e.g. 192.168.x.x from phone on Wi-Fi) uses that IP on port 4000.
 * - In production (Vercel or any deployed domain):
 *   - Automatically connects to the production Render backend.
 */
export function getApiBaseUrl(): string {
  // 1. Explicit environment variable takes highest priority
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '');
  }

  // 2. Client-side browser execution
  if (typeof window !== 'undefined' && window.location?.hostname) {
    const protocol = window.location.protocol || 'http:';
    const hostname = window.location.hostname;

    // Local machine development (localhost / 127.0.0.1)
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${protocol}//${hostname}:4000/api/v1`;
    }

    // Local Wi-Fi / private LAN IP testing (e.g. phone on 192.168.x.x, 10.x.x.x, 172.16-31.x.x)
    const isLanIp = /^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(hostname);
    if (isLanIp) {
      return `${protocol}//${hostname}:4000/api/v1`;
    }

    // Deployed domain in browser (e.g. https://kobbys-intertech-services.vercel.app)
    return PRODUCTION_API_URL;
  }

  // 3. Server-side rendering (SSR) fallback
  if (process.env.NODE_ENV === 'production') {
    return PRODUCTION_API_URL;
  }

  return 'http://localhost:4000/api/v1';
}
