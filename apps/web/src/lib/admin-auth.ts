export const SESSION_COOKIE = 'kis_admin_session';

export type AdminSession = {
  exp: number;
  accessToken: string;
  user: {
    email: string;
    roles: string[];
  };
};

function getAdminSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('ADMIN_SESSION_SECRET must be at least 32 characters in production.');
  }
  return 'local-development-session-secret-change-before-production';
}

const encode = (value: string) => new TextEncoder().encode(value);
const toBase64Url = (value: string) => btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
const fromBase64Url = (value: string) => atob(value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '='));

async function sign(payload: string, secret = getAdminSecret()) {
  const key = await crypto.subtle.importKey('raw', encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, encode(payload));
  return toBase64Url(String.fromCharCode(...new Uint8Array(signature)));
}

export async function createAdminToken(accessToken: string, user: AdminSession['user']): Promise<string> {
  const payload: AdminSession = { exp: Date.now() + 15 * 60 * 1000, accessToken, user };
  const encodedPayload = toBase64Url(JSON.stringify(payload));
  return `${encodedPayload}.${await sign(encodedPayload)}`;
}

export async function getAdminSession(token: string | undefined | null): Promise<AdminSession | null> {
  if (!token) return null;
  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) return null;
  const expectedSignature = await sign(encodedPayload);
  if (signature.length !== expectedSignature.length) return null;
  let different = 0;
  for (let index = 0; index < signature.length; index += 1) different |= signature.charCodeAt(index) ^ expectedSignature.charCodeAt(index);
  if (different !== 0) return null;
  try {
    const session = JSON.parse(fromBase64Url(encodedPayload)) as AdminSession;
    if (!session.exp || !session.accessToken || !session.user?.email || Date.now() >= session.exp) return null;
    return session;
  } catch {
    return null;
  }
}

export async function verifyAdminToken(token: string | undefined | null): Promise<boolean> {
  return Boolean(await getAdminSession(token));
}

export function getServerApiBaseUrl(): string {
  return (process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1').replace(/\/$/, '');
}
