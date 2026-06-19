import { Component, output } from '@angular/core';

@Component({
  selector: 'app-case-workflow-actions',
  template: `
    <div class="metric-actions">
      <button
        class="metric-action"
        type="button"
        data-testid="register-case"
        (click)="registerRequested.emit()"
      >
        Register incoming case
      </button>

      <button
        class="metric-action metric-action--secondary"
        type="button"
        data-testid="move-case-to-review"
        (click)="reviewRequested.emit()"
      >
        Move next case to review
      </button>
    </div>
  `,
  styleUrl: './case-workflow-actions.css',
})
export class CaseWorkflowActions {
  readonly registerRequested = output<void>();
  readonly reviewRequested = output<void>();
}
