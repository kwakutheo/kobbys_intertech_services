import { randomBytes } from 'node:crypto';

export const serviceRequestStatuses = [
  'REQUESTED',
  'UNDER_REVIEW',
  'AWAITING_CUSTOMER',
  'SITE_VISIT_REQUIRED',
  'QUOTATION_PENDING',
  'AWAITING_ACCEPTANCE',
  'AWAITING_PAYMENT',
  'CONFIRMED',
  'ASSIGNED',
  'IN_PROGRESS',
  'COMPLETED',
  'CLOSED',
  'CANCELLED',
  'DECLINED',
] as const;

export type ServiceRequestStatus = (typeof serviceRequestStatuses)[number];

const allowedTransitions: Record<ServiceRequestStatus, readonly ServiceRequestStatus[]> = {
  REQUESTED: ['UNDER_REVIEW', 'CANCELLED', 'DECLINED'],
  UNDER_REVIEW: ['AWAITING_CUSTOMER', 'SITE_VISIT_REQUIRED', 'QUOTATION_PENDING', 'CONFIRMED', 'CANCELLED', 'DECLINED'],
  AWAITING_CUSTOMER: ['UNDER_REVIEW', 'SITE_VISIT_REQUIRED', 'QUOTATION_PENDING', 'CANCELLED', 'DECLINED'],
  SITE_VISIT_REQUIRED: ['UNDER_REVIEW', 'QUOTATION_PENDING', 'CANCELLED', 'DECLINED'],
  QUOTATION_PENDING: ['AWAITING_CUSTOMER', 'AWAITING_ACCEPTANCE', 'CANCELLED', 'DECLINED'],
  AWAITING_ACCEPTANCE: ['AWAITING_PAYMENT', 'CONFIRMED', 'QUOTATION_PENDING', 'CANCELLED', 'DECLINED'],
  AWAITING_PAYMENT: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['ASSIGNED', 'CANCELLED'],
  ASSIGNED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: ['CLOSED'],
  CLOSED: [],
  CANCELLED: [],
  DECLINED: [],
};

export function canTransitionRequest(
  from: ServiceRequestStatus,
  to: ServiceRequestStatus,
): boolean {
  return allowedTransitions[from].includes(to);
}

export function assertValidRequestTransition(
  from: ServiceRequestStatus,
  to: ServiceRequestStatus,
): void {
  if (!canTransitionRequest(from, to)) {
    throw new Error(`Invalid service request transition: ${from} → ${to}`);
  }
}

const referenceAlphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function createPublicRequestReference(): string {
  const bytes = randomBytes(8);
  const token = Array.from(bytes, (byte) => referenceAlphabet[byte % referenceAlphabet.length]).join('');
  return `KIS-SRV-${token}`;
}
