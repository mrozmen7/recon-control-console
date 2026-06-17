import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header';

@Component({
  selector: 'app-shell',
  imports: [Header, RouterOutlet],
  template: `
    <div class="shell">
      <app-header [title]="title()" phaseLabel="Phase 2: Components" />

      <main class="main">
        <section class="page-heading" aria-labelledby="page-title">
          <p class="eyebrow">Angular reference project</p>
          <h1 id="page-title">{{ title() }}</h1>
          <p>
            A professional reconciliation operations console built step by step
            while learning modern Angular patterns.
          </p>
        </section>

        <section class="overview-grid" aria-label="Operational overview">
          <article>
            <span>Open cases</span>
            <strong>0</strong>
            <small>Mock data arrives in the data-fetching phase.</small>
          </article>

          <article>
            <span>Review queue</span>
            <strong>0</strong>
            <small>SignalStore will own this state later.</small>
          </article>

          <article>
            <span>SLA at risk</span>
            <strong>0</strong>
            <small>Computed signals will derive this value.</small>
          </article>
        </section>

        <section class="learning-panel" aria-labelledby="learning-title">
          <div>
            <p class="eyebrow">Current learning checkpoint</p>
            <h2 id="learning-title">Components and templates</h2>
            <p>
              The root component delegates layout to AppShell, and Header is a
              separate child component that receives data through a signal input.
            </p>
          </div>
        </section>

        <router-outlet />
      </main>
    </div>
  `,
  styleUrl: './app-shell.css',
})
export class AppShell {
  protected readonly title = signal('Recon Control Console');
}
