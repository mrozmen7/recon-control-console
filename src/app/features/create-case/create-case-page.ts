import { Component } from '@angular/core';

@Component({
  selector: 'app-create-case-page',
  template: `
    <section class="placeholder-page" aria-labelledby="create-case-title">
      <p class="eyebrow">Case intake</p>
      <h1 id="create-case-title">Create reconciliation case</h1>
      <p>
        This route is ready for the Signal Forms phase. Validation and submission
        behavior will be added when that topic is introduced.
      </p>
    </section>
  `,
  styleUrl: './create-case-page.css',
})
export class CreateCasePage {}
