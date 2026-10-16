import { describe, expect, it } from 'vitest';
import {
  assertValidRequestTransition,
  canTransitionRequest,
  createPublicRequestReference,
} from './request-status.js';

describe('service request workflow', () => {
  it('allows valid lifecycle transitions', () => {
    expect(canTransitionRequest('REQUESTED', 'UNDER_REVIEW')).toBe(true);
    expect(canTransitionRequest('ASSIGNED', 'IN_PROGRESS')).toBe(true);
    expect(canTransitionRequest('COMPLETED', 'CLOSED')).toBe(true);
  });

  it('rejects invalid lifecycle transitions', () => {
    expect(canTransitionRequest('REQUESTED', 'COMPLETED')).toBe(false);
    expect(() => assertValidRequestTransition('CLOSED', 'UNDER_REVIEW')).toThrow(
      'Invalid service request transition',
    );
  });

  it('creates non-sequential public references', () => {
    const first = createPublicRequestReference();
    const second = createPublicRequestReference();

    expect(first).toMatch(/^KIS-SRV-[A-Z2-9]{8}$/);
    expect(second).toMatch(/^KIS-SRV-[A-Z2-9]{8}$/);
    expect(first).not.toBe(second);
  });
});
