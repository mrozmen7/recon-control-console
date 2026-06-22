import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CasesService } from '../data-access/cases.service';

@Component({
  selector: 'app-case-detail-page',
  imports: [RouterLink],
  template: `
    <section class="detail-page" aria-labelledby="case-detail-title">
      <a class="back-link" routerLink="/cases">Back to cases</a>

      @if (casesResource.isLoading()) {
        <div
          class="detail-state"
          role="status"
          aria-live="polite"
          data-testid="case-detail-loading"
        >
          <span class="detail-state__spinner" aria-hidden="true"></span>
          <h1 id="case-detail-title">Loading case</h1>
          <p>The reconciliation record is being retrieved.</p>
        </div>
      } @else if (casesResource.error()) {
        <div class="detail-state detail-state--error" role="alert" data-testid="case-detail-error">
          <h1 id="case-detail-title">Case could not be loaded</h1>
          <p>The data service is currently unavailable.</p>
          <button type="button" data-testid="reload-case-detail" (click)="reloadCases()">
            Try again
          </button>
        </div>
      } @else if (selectedCase(); as reconciliationCase) {
        <header class="detail-header">
          <div>
            <p class="eyebrow">Reconciliation case</p>
            <h1 id="case-detail-title">{{ reconciliationCase.id }}</h1>
            <p class="reference">Transaction reference: {{ reconciliationCase.reference }}</p>
          </div>

          @switch (reconciliationCase.status) {
            @case ('OPEN') {
              <span class="status status--open">Open</span>
            }
            @case ('IN_REVIEW') {
              <span class="status status--review">In review</span>
            }
            @case ('RESOLVED') {
              <span class="status status--resolved">Resolved</span>
            }
          }
        </header>

        <dl class="detail-grid" data-testid="case-detail">
          <div>
            <dt>Case ID</dt>
            <dd>{{ reconciliationCase.id }}</dd>
          </div>
          <div>
            <dt>Transaction reference</dt>
            <dd>{{ reconciliationCase.reference }}</dd>
          </div>
          <div>
            <dt>Workflow status</dt>
            <dd>{{ reconciliationCase.status }}</dd>
          </div>
          <div>
            <dt>SLA</dt>
            <dd>
              @if (reconciliationCase.status === 'RESOLVED') {
                Completed
              } @else {
                {{ reconciliationCase.slaHoursRemaining }} hours remaining
              }
            </dd>
          </div>
        </dl>

        <section class="learning-panel" aria-labelledby="routing-learning-title">
          <p class="eyebrow">Current learning checkpoint</p>
          <h2 id="routing-learning-title">Route parameter as a signal input</h2>
          <p>
            The Router matched <code>/cases/:caseId</code> and bound
            <code>{{ caseId() }}</code> directly to the component input.
          </p>
        </section>
      } @else {
        <div class="detail-state" data-testid="case-detail-not-found">
          <h1 id="case-detail-title">Case not found</h1>
          <p>
            No reconciliation case exists for <strong>{{ caseId() }}</strong
            >.
          </p>
          <a class="primary-link" routerLink="/cases">Return to case register</a>
        </div>
      }
    </section>
  `,
  styleUrl: './case-detail-page.css',
})
export class CaseDetailPage {
  readonly caseId = input.required<string>();

  private readonly casesService = inject(CasesService);
  protected readonly casesResource = this.casesService.casesResource;

  protected readonly selectedCase = computed(() =>
    this.casesResource
      .value()
      .find((reconciliationCase) => reconciliationCase.id === this.caseId()),
  );

  protected reloadCases(): void {
    this.casesResource.reload();
  }
}
