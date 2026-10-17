export function getJwtAccessSecret(): string {
  const configuredSecret = process.env.JWT_ACCESS_SECRET;
  if (configuredSecret && configuredSecret.length >= 32) return configuredSecret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_ACCESS_SECRET must be at least 32 characters in production.');
  }
  return 'local-development-secret-not-for-production';
}
