import { Component, computed, input, linkedSignal, model } from '@angular/core';

@Component({
  selector: 'app-case-search',
  template: `
    <form data-testid="case-search-form" (submit)="applySearch($event)">
      <label for="case-search">Search cases</label>

      <div class="search-controls">
        <input
          #searchInput
          id="case-search"
          type="search"
          data-testid="case-search-input"
          placeholder="Search by case or transaction reference"
          [value]="draftQuery()"
          (input)="draftQuery.set(searchInput.value)"
        />

        <button type="submit">Search</button>
        <button class="secondary" type="button" data-testid="clear-search" (click)="clearSearch()">
          Clear
        </button>
      </div>

      <small data-testid="case-search-summary" aria-live="polite">
        {{ resultSummary() }}
      </small>
    </form>
  `,
  styleUrl: './case-search.css',
})
export class CaseSearch {
  readonly query = model('');
  readonly resultCount = input.required<number>();

  protected readonly draftQuery = linkedSignal(() => this.query());

  protected readonly resultSummary = computed(() => {
    const count = this.resultCount();
    const noun = count === 1 ? 'case' : 'cases';

    return this.query() ? `${count} matching ${noun}` : `${count} total ${noun}`;
  });

  protected applySearch(event: Event): void {
    event.preventDefault();

    const normalizedQuery = this.draftQuery().trim();

    this.draftQuery.set(normalizedQuery);
    this.query.set(normalizedQuery);
  }

  protected clearSearch(): void {
    this.draftQuery.set('');
    this.query.set('');
  }
}
