import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { vi } from 'vitest';
import { InteractionLoggerService } from '../../../core/logging/interaction-logger.service';
import { ReviewQueueApiService } from './review-queue-api.service';
import { ReviewQueueStore } from './review-queue.store';

describe('ReviewQueueStore', () => {
  const api = {
    approveCase: vi.fn(),
  };

  beforeEach(() => {
    api.approveCase.mockReset();

    TestBed.configureTestingModule({
      providers: [
        ReviewQueueStore,
        {
          provide: ReviewQueueApiService,
          useValue: api,
        },
      ],
    });

    TestBed.inject(InteractionLoggerService).clear();
  });

  it('moves a case optimistically while approval is in flight', () => {
    const approval = new Subject<{ readonly caseId: string }>();
    api.approveCase.mockReturnValue(approval);
    const store = TestBed.inject(ReviewQueueStore);

    store.approveCase('CASE-1002');

    expect(store.actionInFlightCaseId()).toBe('CASE-1002');
    expect(store.readyCases().map((queueCase) => queueCase.id)).not.toContain('CASE-1002');
    expect(store.resolvedCases().map((queueCase) => queueCase.id)).toContain('CASE-1002');

    approval.next({ caseId: 'CASE-1002' });
    approval.complete();

    expect(store.actionInFlightCaseId()).toBeNull();
    expect(store.error()).toBeNull();
  });

  it('rolls back the optimistic update when approval fails', () => {
    const approval = new Subject<{ readonly caseId: string }>();
    api.approveCase.mockReturnValue(approval);
    const store = TestBed.inject(ReviewQueueStore);

    store.approveCase('CASE-1005');
    expect(store.resolvedCases().map((queueCase) => queueCase.id)).toContain('CASE-1005');

    approval.error(new Error('API rejected approval'));

    expect(store.actionInFlightCaseId()).toBeNull();
    expect(store.escalatedCases().map((queueCase) => queueCase.id)).toContain('CASE-1005');
    expect(store.resolvedCases().map((queueCase) => queueCase.id)).not.toContain('CASE-1005');
    expect(store.error()).toContain('Approval failed for CASE-1005');
    expect(store.lastRollbackCaseId()).toBe('CASE-1005');
  });

  it('uses exhaustMap to ignore a second approval while one is running', () => {
    const approval = new Subject<{ readonly caseId: string }>();
    api.approveCase.mockReturnValue(approval);
    const store = TestBed.inject(ReviewQueueStore);

    store.approveCase('CASE-1002');
    store.approveCase('CASE-1005');

    expect(api.approveCase).toHaveBeenCalledOnce();
    expect(api.approveCase).toHaveBeenCalledWith('CASE-1002', { shouldFail: false });
    expect(store.escalatedCases().map((queueCase) => queueCase.id)).toContain('CASE-1005');
  });

  it('marks the next request for rollback simulation', () => {
    const approval = new Subject<{ readonly caseId: string }>();
    api.approveCase.mockReturnValue(approval);
    const store = TestBed.inject(ReviewQueueStore);

    store.simulateNextApprovalFailure();
    store.approveCase('CASE-1002');

    expect(api.approveCase).toHaveBeenCalledWith('CASE-1002', { shouldFail: true });
    expect(store.failNextApproval()).toBe(false);
  });
});
