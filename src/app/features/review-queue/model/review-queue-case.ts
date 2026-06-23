export type ReviewQueuePriority = 'NORMAL' | 'HIGH' | 'CRITICAL';
export type ReviewQueueStatus = 'IN_REVIEW' | 'ESCALATED' | 'APPROVED';

export interface ReviewQueueCase {
  readonly id: string;
  readonly reference: string;
  readonly owner: string;
  readonly slaHoursRemaining: number;
  readonly priority: ReviewQueuePriority;
  readonly status: ReviewQueueStatus;
}

export const INITIAL_REVIEW_QUEUE_CASES: readonly ReviewQueueCase[] = [
  {
    id: 'CASE-1002',
    reference: 'TXN-2026-002',
    owner: 'Payments analyst',
    priority: 'NORMAL',
    status: 'IN_REVIEW',
    slaHoursRemaining: 6,
  },
  {
    id: 'CASE-1005',
    reference: 'TXN-2026-005',
    owner: 'Settlement analyst',
    priority: 'CRITICAL',
    status: 'ESCALATED',
    slaHoursRemaining: 2,
  },
];
