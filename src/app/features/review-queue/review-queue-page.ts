import { Component, computed, inject, signal } from '@angular/core';
import { RECON_CONSOLE_CONFIG } from '../../core/config/recon-console.config';
import { InteractionLoggerService } from '../../core/logging/interaction-logger.service';
import { ClickLoggerDirective } from '../../shared/directives/click-logger.directive';
import { TabGroup } from '../../shared/tabs/tab-group';
import { TabPanel } from '../../shared/tabs/tab-panel';
import { ReviewQueueSessionService } from './data-access/review-queue-session.service';

interface ReviewQueueCase {
  readonly id: string;
  readonly reference: string;
  readonly owner: string;
  readonly slaHoursRemaining: number;
  readonly priority: 'NORMAL' | 'HIGH' | 'CRITICAL';
}

@Component({
  selector: 'app-review-queue-page',
  imports: [ClickLoggerDirective, TabGroup, TabPanel],
  providers: [ReviewQueueSessionService],
  template: `
    <section class="page-heading" aria-labelledby="queue-title">
      <p class="eyebrow">Review workflow</p>
      <h1 id="queue-title">Review queue</h1>
      <p>
        Coordinate analyst review work with shared tabs, scoped session state, and reusable
        interaction logging.
      </p>
    </section>

    <section class="queue-summary" aria-label="Review queue summary">
      <article>
        <span>Product config</span>
        <strong>{{ productName }}</strong>
        <small>Provided through an InjectionToken.</small>
      </article>

      <article>
        <span>Session scope</span>
        <strong data-testid="session-id">{{ session.sessionId }}</strong>
        <small>This service instance belongs to this routed page.</small>
      </article>

      <article>
        <span>Session actions</span>
        <strong data-testid="session-action-count">{{ session.actionCount() }}</strong>
        <small>Updated by page-level review actions.</small>
      </article>
    </section>

    <section class="queue-workspace" aria-labelledby="workspace-title">
      <div class="workspace-header">
        <div>
          <p class="eyebrow">Shared UI pattern</p>
          <h2 id="workspace-title">Analyst workspace</h2>
        </div>
        <p>{{ riskSummary() }}</p>
      </div>

      <app-tab-group ariaLabel="Review queue workspaces">
        <app-tab-panel title="Ready for review" value="ready">
          <div class="queue-list" data-testid="ready-panel">
            @for (queueCase of readyCases(); track queueCase.id) {
              <article>
                <div>
                  <span>{{ queueCase.id }}</span>
                  <strong>{{ queueCase.reference }}</strong>
                  <small>{{ queueCase.owner }} · {{ queueCase.priority }}</small>
                </div>

                <button
                  type="button"
                  [appClickLogger]="'review-queue.assign'"
                  [appClickLoggerMetadata]="{ caseId: queueCase.id, queue: 'ready' }"
                  (click)="recordReviewAction()"
                >
                  Assign review
                </button>
              </article>
            }
          </div>
        </app-tab-panel>

        <app-tab-panel title="Escalations" value="escalations">
          <div class="queue-list" data-testid="escalations-panel">
            @for (queueCase of escalatedCases(); track queueCase.id) {
              <article class="critical">
                <div>
                  <span>{{ queueCase.id }}</span>
                  <strong>{{ queueCase.reference }}</strong>
                  <small>{{ queueCase.slaHoursRemaining }} hours remaining</small>
                </div>

                <button
                  type="button"
                  [appClickLogger]="'review-queue.escalate'"
                  [appClickLoggerMetadata]="{ caseId: queueCase.id, queue: 'escalations' }"
                  (click)="recordReviewAction()"
                >
                  Escalate
                </button>
              </article>
            }
          </div>
        </app-tab-panel>

        <app-tab-panel title="Resolved today" value="resolved">
          <div class="empty-state" data-testid="resolved-panel">
            <h3>No resolved reviews yet</h3>
            <p>SignalStore will own completed review state in the next enterprise state phase.</p>
          </div>
        </app-tab-panel>
      </app-tab-group>
    </section>

    <section class="audit-panel" aria-labelledby="audit-title">
      <div>
        <p class="eyebrow">Shared directive</p>
        <h2 id="audit-title">Interaction audit</h2>
      </div>

      @if (auditEntries().length > 0) {
        <ol data-testid="audit-list">
          @for (entry of auditEntries(); track entry.timestamp) {
            <li>
              <strong>{{ entry.action }}</strong>
              <small>{{ entry.timestamp }}</small>
            </li>
          }
        </ol>
      } @else {
        <div class="empty-state" data-testid="audit-empty">
          <h3>No interactions captured</h3>
          <p>Click a review action or switch tabs to create local audit entries.</p>
        </div>
      }
    </section>

    <section class="learning-panel" aria-labelledby="learning-title">
      <p class="eyebrow">Current learning checkpoint</p>
      <h2 id="learning-title">Dependency Injection and shared patterns</h2>
      <p>
        This page combines an InjectionToken, root service, scoped provider, shared directive, host
        directive, content projection, and content children.
      </p>
    </section>
  `,
  styleUrl: './review-queue-page.css',
})
export class ReviewQueuePage {
  private readonly config = inject(RECON_CONSOLE_CONFIG);
  private readonly logger = inject(InteractionLoggerService);
  protected readonly session = inject(ReviewQueueSessionService);

  protected readonly productName = this.config.productName;
  protected readonly auditEntries = this.logger.recentEntries;

  protected readonly readyCases = signal<ReviewQueueCase[]>([
    {
      id: 'CASE-1002',
      reference: 'TXN-2026-002',
      owner: 'Payments analyst',
      priority: 'NORMAL',
      slaHoursRemaining: 6,
    },
    {
      id: 'CASE-1005',
      reference: 'TXN-2026-005',
      owner: 'Settlement analyst',
      priority: 'CRITICAL',
      slaHoursRemaining: 2,
    },
  ]);

  protected readonly escalatedCases = computed(() =>
    this.readyCases().filter(
      (queueCase) =>
        queueCase.priority === 'CRITICAL' ||
        queueCase.slaHoursRemaining <= this.config.reviewSlaRiskHours,
    ),
  );

  protected readonly riskSummary = computed(() => {
    const riskCount = this.escalatedCases().length;

    if (riskCount === 0) {
      return `No cases are inside the ${this.config.reviewSlaRiskHours}-hour risk threshold.`;
    }

    return `${riskCount} case is inside the ${this.config.reviewSlaRiskHours}-hour risk threshold.`;
  });

  protected recordReviewAction(): void {
    this.session.recordAction();
  }
}
