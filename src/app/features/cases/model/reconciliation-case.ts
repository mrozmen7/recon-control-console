export type CaseStatus = 'OPEN' | 'IN_REVIEW' | 'RESOLVED';

export interface ReconciliationCase {
  id: string;
  reference: string;
  status: CaseStatus;
  slaHoursRemaining: number;
}
