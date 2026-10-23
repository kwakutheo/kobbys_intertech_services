import { ThrottlerGetTrackerFunction } from '@nestjs/throttler';

/**
 * Throttles credential endpoints by the account being targeted instead of the
 * caller's IP address. A shared office or mobile network must not lock out a
 * whole team, while repeated guesses against one email address still count
 * against that account. Falls back to the request IP when no email is supplied,
 * so malformed probes cannot be used to obtain a fresh bucket every time.
 */
export const throttleByIdentity: ThrottlerGetTrackerFunction = (req) => {
  const body = req.body as { email?: unknown } | undefined;
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (email) return `identity:${email}`;
  return String(req.ip ?? 'unknown-host');
};
