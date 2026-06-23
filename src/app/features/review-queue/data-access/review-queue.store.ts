import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, exhaustMap, tap } from 'rxjs';
import { RECON_CONSOLE_CONFIG } from '../../../core/config/recon-console.config';
import { InteractionLoggerService } from '../../../core/logging/interaction-logger.service';
import { INITIAL_REVIEW_QUEUE_CASES, ReviewQueueCase } from '../model/review-queue-case';
import { ReviewQueueApiService } from './review-queue-api.service';

interface ReviewQueueState {
  readonly cases: readonly ReviewQueueCase[];
  readonly actionInFlightCaseId: string | null;
  readonly error: string | null;
  readonly failNextApproval: boolean;
  readonly lastRollbackCaseId: string | null;
}

const initialState: ReviewQueueState = {
  cases: INITIAL_REVIEW_QUEUE_CASES,
  actionInFlightCaseId: null,
  error: null,
  failNextApproval: false,
  lastRollbackCaseId: null,
};

export const ReviewQueueStore = signalStore(
  withState(initialState),
  withComputed((store) => {
    const config = inject(RECON_CONSOLE_CONFIG);

    return {
      readyCases: computed(() =>
        store.cases().filter((queueCase) => queueCase.status === 'IN_REVIEW'),
      ),
      escalatedCases: computed(() =>
        store
          .cases()
          .filter(
            (queueCase) =>
              queueCase.status === 'ESCALATED' ||
              (queueCase.status === 'IN_REVIEW' &&
                queueCase.slaHoursRemaining <= config.reviewSlaRiskHours),
          ),
      ),
      resolvedCases: computed(() =>
        store.cases().filter((queueCase) => queueCase.status === 'APPROVED'),
      ),
      riskSummary: computed(() => {
        const riskCount = store
          .cases()
          .filter(
            (queueCase) =>
              queueCase.status !== 'APPROVED' &&
              queueCase.slaHoursRemaining <= config.reviewSlaRiskHours,
          ).length;

        if (riskCount === 0) {
          return `No cases are inside the ${config.reviewSlaRiskHours}-hour risk threshold.`;
        }

        return `${riskCount} case is inside the ${config.reviewSlaRiskHours}-hour risk threshold.`;
      }),
    };
  }),
  withMethods((store) => {
    const api = inject(ReviewQueueApiService);
    const logger = inject(InteractionLoggerService);

    return {
      approveCase: rxMethod<string>((caseId$) =>
        caseId$.pipe(
          exhaustMap((caseId) => {
            const previousCases = store.cases();
            const shouldFail = store.failNextApproval();

            patchState(store, {
              cases: approveOptimistically(previousCases, caseId),
              actionInFlightCaseId: caseId,
              error: null,
              failNextApproval: false,
              lastRollbackCaseId: null,
            });

            logger.log('review-queue.approve.optimistic', { caseId });

            return api.approveCase(caseId, { shouldFail }).pipe(
              tap(() => {
                patchState(store, {
                  actionInFlightCaseId: null,
                });

                logger.log('review-queue.approve.success', { caseId });
              }),
              catchError(() => {
                patchState(store, {
                  cases: previousCases,
                  actionInFlightCaseId: null,
                  error: `Approval failed for ${caseId}. Optimistic update was rolled back.`,
                  lastRollbackCaseId: caseId,
                });

                logger.log('review-queue.approve.rollback', { caseId });

                return EMPTY;
              }),
            );
          }),
        ),
      ),
      simulateNextApprovalFailure(): void {
        patchState(store, {
          failNextApproval: true,
          error: null,
          lastRollbackCaseId: null,
        });
      },
      dismissError(): void {
        patchState(store, {
          error: null,
          lastRollbackCaseId: null,
        });
      },
      resetQueue(): void {
        patchState(store, initialState);
        logger.clear();
      },
    };
  }),
);

function approveOptimistically(
  cases: readonly ReviewQueueCase[],
  caseId: string,
): readonly ReviewQueueCase[] {
  return cases.map((queueCase) =>
    queueCase.id === caseId
      ? {
          ...queueCase,
          status: 'APPROVED',
        }
      : queueCase,
  );
}
