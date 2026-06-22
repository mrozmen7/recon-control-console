import { Component, computed, inject, signal } from '@angular/core';
import type { ReconciliationCase } from './model/reconciliation-case';
import { CaseMetricCard } from './ui/case-metric-card';
import { CaseWorkflowActions } from './ui/case-workflow-actions';
import { CaseSearch } from './ui/case-search';
import { ReconciliationCaseCard } from './ui/reconciliation-case-card';
import { CasesService } from './data-access/cases.service';

@Component({
  selector: 'app-cases-page',
  imports: [CaseMetricCard, CaseWorkflowActions, CaseSearch, ReconciliationCaseCard],
  template: `
    <section class="page-heading" aria-labelledby="cases-title">
      <p class="eyebrow">Operations workspace</p>
      <h1 id="cases-title">Reconciliation cases</h1>
      <p>
        Monitor reconciliation exceptions, ownership, and review status from one focused workspace.
      </p>
    </section>

    @if (casesResource.isLoading()) {
      <section class="resource-state" role="status" aria-live="polite" data-testid="cases-loading">
        <span class="resource-state__spinner" aria-hidden="true"></span>
        <h2>Loading cases</h2>
        <p>Operational case data is being retrieved.</p>
      </section>
    } @else if (casesResource.error()) {
      <section class="resource-state resource-state--error" role="alert" data-testid="cases-error">
        <h2>Cases could not be loaded</h2>
        <p>The data service is currently unavailable. Retry the request to continue.</p>

        <button
          class="resource-state__action"
          type="button"
          data-testid="reload-cases"
          (click)="reloadCases()"
        >
          Try again
        </button>
      </section>
    } @else {
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

      <section class="case-results" aria-labelledby="case-results-title">
        <div class="case-results__header">
          <div>
            <p class="eyebrow">Case register</p>
            <h2 id="case-results-title">Operational cases</h2>
          </div>

          @if (searchQuery()) {
            <p class="active-filter">
              Filtered by: <strong>{{ searchQuery() }}</strong>
            </p>
          }
        </div>

        @if (cases().length === 0) {
          <div class="empty-state" data-testid="empty-case-register">
            <h3>No operational cases</h3>
            <p>The data source returned no reconciliation cases.</p>
          </div>
        } @else if (filteredCases().length > 0) {
          <div class="case-grid" data-testid="case-list">
            @for (reconciliationCase of filteredCases(); track reconciliationCase.id) {
              <app-reconciliation-case-card [reconciliationCase]="reconciliationCase" />
            }
          </div>
        } @else {
          <div class="empty-state" data-testid="empty-case-list">
            <h3>No matching cases</h3>
            <p>Clear the current search or try another case or transaction reference.</p>
          </div>
        }
      </section>
    }

    <section class="learning-panel" aria-labelledby="learning-title">
      <p class="eyebrow">Current learning checkpoint</p>
      <h2 id="learning-title">Declarative data fetching</h2>
      <p>
        Angular derives loading, error, empty, and success views from one
        <code>httpResource</code> state.
      </p>
    </section>
  `,
  styleUrl: './cases-page.css',
})
export class CasesPage {
  private readonly casesService = inject(CasesService);
  protected readonly casesResource = this.casesService.casesResource;
  protected readonly cases = this.casesResource.value;
  protected readonly searchQuery = signal('');

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

  protected readonly filteredCases = computed(() => {
    const normalizedQuery = this.searchQuery().trim().toLowerCase();
    const currentCases = this.cases();

    if (!normalizedQuery) {
      return currentCases;
    }

    return currentCases.filter(
      (reconciliationCase) =>
        reconciliationCase.id.toLowerCase().includes(normalizedQuery) ||
        reconciliationCase.reference.toLowerCase().includes(normalizedQuery),
    );
  });

  protected readonly matchingCaseCount = computed(() => this.filteredCases().length);

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

  protected reloadCases(): void {
    this.casesResource.reload();
  }
}
