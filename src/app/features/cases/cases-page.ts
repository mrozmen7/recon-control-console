import { Component, computed, signal } from '@angular/core';
import type { ReconciliationCase } from './model/reconciliation-case';
import { CaseMetricCard } from './ui/case-metric-card';
import { CaseWorkflowActions } from './ui/case-workflow-actions';
import { CaseSearch } from './ui/case-search';

@Component({
  selector: 'app-cases-page',
  imports: [CaseMetricCard, CaseWorkflowActions, CaseSearch],
  template: `
    <section class="page-heading" aria-labelledby="cases-title">
      <p class="eyebrow">Operations workspace</p>
      <h1 id="cases-title">Reconciliation cases</h1>
      <p>
        Monitor reconciliation exceptions, ownership, and review status from one focused workspace.
      </p>
    </section>

    <app-case-search [(query)]="searchQuery" [resultCount]="matchingCaseCount()" />

    <section class="overview-grid" aria-label="Operational overview">
      <article>
        <span>Open cases</span>
        <strong data-testid="open-cases-count">{{ openCaseCount() }}</strong>
        <small>Cases currently awaiting operational action.</small>

        <app-case-workflow-actions
          (registerRequested)="registerIncomingCase()"
          (reviewRequested)="moveNextOpenCaseToReview()"
        />
      </article>

      <app-case-metric-card
        label="Review queue"
        [value]="reviewQueueCount()"
        description="Cases assigned to active analyst review."
        testId="review-queue-count"
      />

      <app-case-metric-card
        label="SLA at risk"
        [value]="slaAtRiskCount()"
        description="Active cases with four hours or less remaining."
        testId="sla-risk-count"
      />
    </section>

    <section class="learning-panel" aria-labelledby="learning-title">
      <p class="eyebrow">Current learning checkpoint</p>
      <h2 id="learning-title">Signal component model</h2>
      <p>
        Parent and child components communicate through signal inputs, outputs, models, computed
        values, and linked state.
      </p>
    </section>
  `,
  styleUrl: './cases-page.css',
})
export class CasesPage {
  protected readonly searchQuery = signal('');

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

  protected readonly matchingCaseCount = computed(() => {
    const normalizedQuery = this.searchQuery().trim().toLowerCase();
    const currentCases = this.cases();

    if (!normalizedQuery) {
      return currentCases.length;
    }

    return currentCases.filter(
      (reconciliationCase) =>
        reconciliationCase.id.toLowerCase().includes(normalizedQuery) ||
        reconciliationCase.reference.toLowerCase().includes(normalizedQuery),
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
