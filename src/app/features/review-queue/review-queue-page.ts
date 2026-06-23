import { Component, inject } from '@angular/core';
import { RECON_CONSOLE_CONFIG } from '../../core/config/recon-console.config';
import { InteractionLoggerService } from '../../core/logging/interaction-logger.service';
import { ClickLoggerDirective } from '../../shared/directives/click-logger.directive';
import { TabGroup } from '../../shared/tabs/tab-group';
import { TabPanel } from '../../shared/tabs/tab-panel';
import { ReviewQueueApiService } from './data-access/review-queue-api.service';
import { ReviewQueueSessionService } from './data-access/review-queue-session.service';
import { ReviewQueueStore } from './data-access/review-queue.store';
import { ReviewAuditPanel } from './ui/review-audit-panel';

@Component({
  selector: 'app-review-queue-page',
  imports: [ClickLoggerDirective, ReviewAuditPanel, TabGroup, TabPanel],
  providers: [ReviewQueueApiService, ReviewQueueSessionService, ReviewQueueStore],
  template: `
    <section class="page-heading" aria-labelledby="queue-title">
      <p class="eyebrow">Review workflow</p>
      <h1 id="queue-title">Review queue</h1>
      <p>
        Coordinate analyst review work with SignalStore state, RxJS concurrency, optimistic updates,
        rollback handling, and deferred audit rendering.
      </p>
    </section>

    <section class="queue-summary" aria-label="Review queue summary">
      <article>
        <span>Product config</span>
        <strong>{{ productName }}</strong>
        <small>Provided through an InjectionToken.</small>
      </article>

      <article>
        <span>Store state</span>
        <strong data-testid="resolved-count">{{ store.resolvedCases().length }}</strong>
        <small>Approved cases are derived from SignalStore state.</small>
      </article>

      <article>
        <span>Session actions</span>
        <strong data-testid="session-action-count">{{ session.actionCount() }}</strong>
        <small>Updated by page-level review actions.</small>
      </article>
    </section>

    @if (store.error()) {
      <section class="rollback-alert" role="alert" data-testid="rollback-alert">
        <div>
          <strong>Rollback completed</strong>
          <span>{{ store.error() }}</span>
        </div>
        <button type="button" (click)="store.dismissError()" data-testid="dismiss-rollback">
          Dismiss
        </button>
      </section>
    }

    <section class="queue-workspace" aria-labelledby="workspace-title">
      <div class="workspace-header">
        <div>
          <p class="eyebrow">SignalStore workspace</p>
          <h2 id="workspace-title">Analyst workspace</h2>
        </div>
        <p>{{ store.riskSummary() }}</p>
      </div>

      <div class="store-actions">
        <button
          type="button"
          class="secondary-action"
          [class.active]="store.failNextApproval()"
          [appClickLogger]="'review-queue.simulate-failure'"
          (click)="store.simulateNextApprovalFailure()"
          data-testid="simulate-failure"
        >
          Simulate next failure
        </button>

        <button
          type="button"
          class="secondary-action"
          [appClickLogger]="'review-queue.reset'"
          (click)="resetQueue()"
          data-testid="reset-queue"
        >
          Reset queue
        </button>
      </div>

      @if (store.actionInFlightCaseId(); as caseId) {
        <div class="in-flight-state" role="status" data-testid="action-in-flight">
          Saving optimistic approval for {{ caseId }}...
        </div>
      }

      <app-tab-group ariaLabel="Review queue workspaces">
        <app-tab-panel title="Ready for review" value="ready">
          @if (store.readyCases().length > 0) {
            <div class="queue-list" data-testid="ready-panel">
              @for (queueCase of store.readyCases(); track queueCase.id) {
                <article>
                  <div>
                    <span>{{ queueCase.id }}</span>
                    <strong>{{ queueCase.reference }}</strong>
                    <small>{{ queueCase.owner }} · {{ queueCase.priority }}</small>
                  </div>

                  <button
                    type="button"
                    [disabled]="store.actionInFlightCaseId() !== null"
                    [appClickLogger]="'review-queue.approve-click'"
                    [appClickLoggerMetadata]="{ caseId: queueCase.id, queue: 'ready' }"
                    (click)="approveCase(queueCase.id)"
                  >
                    Approve
                  </button>
                </article>
              }
            </div>
          } @else {
            <div class="empty-state" data-testid="ready-empty">
              <h3>No cases ready for review</h3>
              <p>Approvals move cases out of this queue immediately through optimistic state.</p>
            </div>
          }
        </app-tab-panel>

        <app-tab-panel title="Escalations" value="escalations">
          @if (store.escalatedCases().length > 0) {
            <div class="queue-list" data-testid="escalations-panel">
              @for (queueCase of store.escalatedCases(); track queueCase.id) {
                <article class="critical">
                  <div>
                    <span>{{ queueCase.id }}</span>
                    <strong>{{ queueCase.reference }}</strong>
                    <small>{{ queueCase.slaHoursRemaining }} hours remaining</small>
                  </div>

                  <button
                    type="button"
                    [disabled]="store.actionInFlightCaseId() !== null"
                    [appClickLogger]="'review-queue.escalation-approve-click'"
                    [appClickLoggerMetadata]="{ caseId: queueCase.id, queue: 'escalations' }"
                    (click)="approveCase(queueCase.id)"
                  >
                    Approve escalation
                  </button>
                </article>
              }
            </div>
          } @else {
            <div class="empty-state" data-testid="escalations-empty">
              <h3>No escalations</h3>
              <p>Rollback restores escalated cases here if the API rejects an optimistic update.</p>
            </div>
          }
        </app-tab-panel>

        <app-tab-panel title="Resolved today" value="resolved">
          @if (store.resolvedCases().length > 0) {
            <div class="queue-list" data-testid="resolved-panel">
              @for (queueCase of store.resolvedCases(); track queueCase.id) {
                <article class="resolved">
                  <div>
                    <span>{{ queueCase.id }}</span>
                    <strong>{{ queueCase.reference }}</strong>
                    <small>Approved by optimistic workflow</small>
                  </div>
                </article>
              }
            </div>
          } @else {
            <div class="empty-state" data-testid="resolved-panel">
              <h3>No resolved reviews yet</h3>
              <p>Approve a case to see optimistic state move it into this panel.</p>
            </div>
          }
        </app-tab-panel>
      </app-tab-group>
    </section>

    @defer (on viewport) {
      <app-review-audit-panel [entries]="auditEntries()" [totalCount]="auditTotalCount()" />
    } @placeholder {
      <section class="audit-placeholder" data-testid="audit-placeholder">
        <p class="eyebrow">Deferred audit</p>
        <h2>Interaction audit</h2>
        <p>The audit panel is deferred until it enters the viewport.</p>
      </section>
    } @loading (minimum 250ms) {
      <section class="audit-placeholder" role="status" data-testid="audit-loading">
        <p class="eyebrow">Deferred audit</p>
        <h2>Loading audit panel</h2>
        <p>Angular is loading the deferred audit component.</p>
      </section>
    }

    <section class="learning-panel" aria-labelledby="learning-title">
      <p class="eyebrow">Current learning checkpoint</p>
      <h2 id="learning-title">SignalStore, RxJS, optimistic update, rollback, and &#64;defer</h2>
      <p>
        Store state owns the queue, <code>rxMethod</code> and <code>exhaustMap</code> manage async
        approval, rollback restores failed optimistic updates, and the audit panel is deferred.
      </p>
    </section>
  `,
  styleUrl: './review-queue-page.css',
})
export class ReviewQueuePage {
  private readonly config = inject(RECON_CONSOLE_CONFIG);
  private readonly logger = inject(InteractionLoggerService);
  protected readonly session = inject(ReviewQueueSessionService);
  protected readonly store = inject(ReviewQueueStore);

  protected readonly productName = this.config.productName;
  protected readonly auditEntries = this.logger.recentEntries;
  protected readonly auditTotalCount = this.logger.totalCount;

  protected approveCase(caseId: string): void {
    this.session.recordAction();
    this.store.approveCase(caseId);
  }

  protected resetQueue(): void {
    this.session.actionCount.set(0);
    this.store.resetQueue();
  }
}
