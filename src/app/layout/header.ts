import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <a class="brand" routerLink="/cases" aria-label="Recon Control Console home">
        <span class="brand-mark">RC</span>
        <span>
          <strong>{{ title() }}</strong>
          <small>Reconciliation operations</small>
        </span>
      </a>

      <nav class="nav" aria-label="Primary navigation">
        <a
          routerLink="/cases"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
        >
          Cases
        </a>
        <a routerLink="/cases/new" routerLinkActive="active">Create case</a>
        <a routerLink="/queue" routerLinkActive="active">Review queue</a>
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
