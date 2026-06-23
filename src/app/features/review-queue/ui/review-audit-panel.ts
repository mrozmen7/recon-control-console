import { Component, input } from '@angular/core';
import type { InteractionLogEntry } from '../../../core/logging/interaction-logger.service';

@Component({
  selector: 'app-review-audit-panel',
  template: `
    <section class="audit-panel" aria-labelledby="audit-title">
      <div>
        <p class="eyebrow">Deferred audit</p>
        <h2 id="audit-title">Interaction audit</h2>
        <p>{{ totalCount() }} captured interaction events in this session.</p>
      </div>

      @if (entries().length > 0) {
        <ol data-testid="audit-list">
          @for (entry of entries(); track entry.timestamp) {
            <li>
              <strong>{{ entry.action }}</strong>
              <small>{{ entry.timestamp }}</small>
            </li>
          }
        </ol>
      } @else {
        <div class="empty-state" data-testid="audit-empty">
          <h3>No interactions captured</h3>
          <p>Click a review action to create local audit entries.</p>
        </div>
      }
    </section>
  `,
  styleUrl: './review-audit-panel.css',
})
export class ReviewAuditPanel {
  readonly entries = input.required<readonly InteractionLogEntry[]>();
  readonly totalCount = input.required<number>();
}
