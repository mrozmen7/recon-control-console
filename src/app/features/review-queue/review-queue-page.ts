import { Component } from '@angular/core';

@Component({
  selector: 'app-review-queue-page',
  template: `
    <section class="placeholder-page" aria-labelledby="queue-title">
      <p class="eyebrow">Review workflow</p>
      <h1 id="queue-title">Review queue</h1>
      <p>
        This route will later demonstrate shared state, optimistic updates, and
        rollback behavior with NgRx SignalStore.
      </p>
    </section>
  `,
  styleUrl: './review-queue-page.css',
})
export class ReviewQueuePage {}
