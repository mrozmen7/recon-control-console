import { Component, input } from '@angular/core';

@Component({
  selector: 'app-case-metric-card',
  template: `
    <article>
      <span>{{ label() }}</span>
      <strong [attr.data-testid]="testId()">{{ value() }}</strong>
      <small>{{ description() }}</small>
    </article>
  `,
  styleUrl: './case-metric-card.css',
})
export class CaseMetricCard {
  readonly label = input.required<string>();
  readonly value = input.required<number>();
  readonly description = input.required<string>();
  readonly testId = input.required<string>();
}
