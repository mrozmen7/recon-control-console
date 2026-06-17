import { Component, input } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <header class="header">
      <a class="brand" href="/" aria-label="Recon Control Console home">
        <span class="brand-mark">RC</span>
        <span>
          <strong>{{ title() }}</strong>
          <small>Reconciliation operations</small>
        </span>
      </a>

      <nav class="nav" aria-label="Primary navigation">
        <a href="/">Overview</a>
        <a href="/">Cases</a>
        <a href="/">Review queue</a>
      </nav>

      <div class="phase">{{ phaseLabel() }}</div>
    </header>
  `,
  styleUrl: './header.css',
})
export class Header {
  readonly title = input.required<string>();
  readonly phaseLabel = input('Phase 2');
}
