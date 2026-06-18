import { Component } from '@angular/core';

@Component({
  selector: 'app-cases-page',
  template: `
    <section class="page-heading" aria-labelledby="cases-title">
      <p class="eyebrow">Operations workspace</p>
      <h1 id="cases-title">Reconciliation cases</h1>
      <p>
        Monitor reconciliation exceptions, ownership, and review status from one
        focused workspace.
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
      <p class="eyebrow">Current learning checkpoint</p>
      <h2 id="learning-title">Routing basics</h2>
      <p>
        This page is rendered inside RouterOutlet when the browser URL matches
        <code>/cases</code>.
      </p>
    </section>
  `,
  styleUrl: './cases-page.css',
})
export class CasesPage {}
