import { Component, computed, signal } from '@angular/core';
import type { ReconciliationCase } from './model/reconciliation-case';

@Component({
  selector: 'app-cases-page',
  template: `
    <section class="page-heading" aria-labelledby="cases-title">
      <p class="eyebrow">Operations workspace</p>
      <h1 id="cases-title">Reconciliation cases</h1>
      <p>
        Monitor reconciliation exceptions, ownership, and review status from one focused workspace.
      </p>
    </section>

    <section class="overview-grid" aria-label="Operational overview">
      <article>
        <span>Open cases</span>
        <strong data-testid="open-cases-count">{{ openCaseCount() }}</strong>
        <small>Cases currently awaiting operational action.</small>

        <div class="metric-actions">
          <button
            class="metric-action"
            type="button"
            data-testid="register-case"
            (click)="registerIncomingCase()"
          >
            Register incoming case
          </button>

          <button
            class="metric-action metric-action--secondary"
            type="button"
            data-testid="move-case-to-review"
            (click)="moveNextOpenCaseToReview()"
          >
            Move next case to review
          </button>
        </div>
      </article>

      <article>
        <span>Review queue</span>
        <strong data-testid="review-queue-count">{{ reviewQueueCount() }}</strong>
        <small>Cases assigned to active analyst review.</small>
      </article>

      <article>
        <span>SLA at risk</span>
        <strong data-testid="sla-risk-count">{{ slaAtRiskCount() }}</strong>
        <small>Active cases with four hours or less remaining.</small>
      </article>
    </section>

    <section class="learning-panel" aria-labelledby="learning-title">
      <p class="eyebrow">Current learning checkpoint</p>
      <h2 id="learning-title">Signals basics</h2>
      <p>
        Operational metrics are derived from one typed case state with writable and computed
        signals.
      </p>
    </section>
  `,
  styleUrl: './cases-page.css',
})
export class CasesPage {
  protected readonly cases = signal<ReconciliationCase[]>([
    {
      id: 'CASE-1001',
      reference: 'TXN-2026-001',
      status: 'OPEN',
      slaHoursRemaining: 2,
    },
    {
      id: 'CASE-1002',
      reference: 'TXN-2026-002',
      status: 'IN_REVIEW',
      slaHoursRemaining: 6,
    },
    {
      id: 'CASE-1003',
      reference: 'TXN-2026-003',
      status: 'OPEN',
      slaHoursRemaining: 12,
    },
    {
      id: 'CASE-1004',
      reference: 'TXN-2026-004',
      status: 'RESOLVED',
      slaHoursRemaining: 0,
    },
  ]);

  protected readonly openCaseCount = computed(() => {
    const currentCases = this.cases();

    return currentCases.filter((reconciliationCase) => reconciliationCase.status === 'OPEN').length;
  });

  protected readonly reviewQueueCount = computed(() => {
    const currentCases = this.cases();

    return currentCases.filter((reconciliationCase) => reconciliationCase.status === 'IN_REVIEW')
      .length;
  });

  protected readonly slaAtRiskCount = computed(() => {
    const currentCases = this.cases();

    return currentCases.filter(
      (reconciliationCase) =>
        reconciliationCase.status !== 'RESOLVED' && reconciliationCase.slaHoursRemaining <= 4,
    ).length;
  });

  protected registerIncomingCase(): void {
    this.cases.update((currentCases) => {
      const nextSequence = currentCases.length + 1;

      const newCase: ReconciliationCase = {
        id: `CASE-${1000 + nextSequence}`,
        reference: `TXN-2026-${nextSequence}`,
        status: 'OPEN',
        slaHoursRemaining: 8,
      };

      return [...currentCases, newCase];
    });
  }

  protected moveNextOpenCaseToReview(): void {
    this.cases.update((currentCases) => {
      const nextOpenCase = currentCases.find(
        (reconciliationCase) => reconciliationCase.status === 'OPEN',
      );

      if (!nextOpenCase) {
        return currentCases;
      }

      return currentCases.map((reconciliationCase) => {
        if (reconciliationCase.id !== nextOpenCase.id) {
          return reconciliationCase;
        }

        const caseInReview: ReconciliationCase = {
          ...reconciliationCase,
          status: 'IN_REVIEW',
        };

        return caseInReview;
      });
    });
  }
}
