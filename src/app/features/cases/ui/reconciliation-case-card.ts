import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { ReconciliationCase } from '../model/reconciliation-case';

@Component({
  selector: 'app-reconciliation-case-card',
  imports: [RouterLink],
  template: `
    <article data-testid="reconciliation-case-card" [attr.data-case-id]="reconciliationCase().id">
      <header>
        <div>
          <span class="case-id">{{ reconciliationCase().id }}</span>
          <h3>{{ reconciliationCase().reference }}</h3>
        </div>

        @switch (reconciliationCase().status) {
          @case ('OPEN') {
            <span class="status status--open" data-testid="case-status">Open</span>
          }
          @case ('IN_REVIEW') {
            <span class="status status--review" data-testid="case-status">In review</span>
          }
          @case ('RESOLVED') {
            <span class="status status--resolved" data-testid="case-status">Resolved</span>
          }
          @default {
            <span class="status" data-testid="case-status">Unknown</span>
          }
        }
      </header>

      <div class="case-meta">
        <span>SLA</span>

        @if (reconciliationCase().status === 'RESOLVED') {
          <strong>Completed</strong>
        } @else {
          <strong>{{ reconciliationCase().slaHoursRemaining }} hours remaining</strong>
        }
      </div>

      @if (isSlaAtRisk()) {
        <p class="risk-message">SLA attention required</p>
      }

      <a
        class="case-link"
        data-testid="case-details-link"
        [routerLink]="['/cases', reconciliationCase().id]"
      >
        View case
      </a>
    </article>
  `,
  styleUrl: './reconciliation-case-card.css',
})
export class ReconciliationCaseCard {
  readonly reconciliationCase = input.required<ReconciliationCase>();

  protected readonly isSlaAtRisk = computed(() => {
    const currentCase = this.reconciliationCase();

    return currentCase.status !== 'RESOLVED' && currentCase.slaHoursRemaining <= 4;
  });
}
