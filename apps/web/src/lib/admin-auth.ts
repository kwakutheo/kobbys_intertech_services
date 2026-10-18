export const SESSION_COOKIE = 'kis_admin_session';

export function getAdminSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || 'kis-admin-secret-change-in-production-2026';
}

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'kobbys2026';
}

export async function createAdminToken(secret = getAdminSecret()): Promise<string> {
  const encoder = new TextEncoder();
  const exp = Date.now() + 8 * 60 * 60 * 1000; // 8 hours
  const data = `${exp}`;
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  const sigHex = Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `${exp}.${sigHex}`;
}

export async function verifyAdminToken(token: string | undefined | null, secret = getAdminSecret()): Promise<boolean> {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [expStr, sigHex] = parts;
  const exp = parseInt(expStr, 10);
  if (isNaN(exp) || Date.now() > exp) return false;

  const hexMatch = sigHex.match(/.{1,2}/g);
  if (!hexMatch || hexMatch.length !== 32) return false;

  const sigBytes = new Uint8Array(hexMatch.map((b) => parseInt(b, 16)));
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  return await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(expStr));
}
