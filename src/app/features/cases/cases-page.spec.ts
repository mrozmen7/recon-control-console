import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import type { ReconciliationCase } from './model/reconciliation-case';
import { CasesService } from './data-access/cases.service';
import { CasesPage } from './cases-page';

const INITIAL_CASES: ReconciliationCase[] = [
  {
    id: 'CASE-1001',
    reference: 'TXN-2026-001',
    status: 'OPEN',
    slaHoursRemaining: 2,
  },
  {
    id: 'CASE-1002',
    reference: 'TXN-2026-002',
    status: 'IN_REVIEW',
    slaHoursRemaining: 6,
  },
  {
    id: 'CASE-1003',
    reference: 'TXN-2026-003',
    status: 'OPEN',
    slaHoursRemaining: 12,
  },
  {
    id: 'CASE-1004',
    reference: 'TXN-2026-004',
    status: 'RESOLVED',
    slaHoursRemaining: 0,
  },
];

describe('CasesPage', () => {
  const cases = signal<ReconciliationCase[]>([]);
  const isLoading = signal(false);
  const error = signal<unknown | undefined>(undefined);
  const reload = vi.fn();

  beforeEach(async () => {
    cases.set(structuredClone(INITIAL_CASES));
    isLoading.set(false);
    error.set(undefined);
    reload.mockReset();

    await TestBed.configureTestingModule({
      imports: [CasesPage],
      providers: [
        provideRouter([]),
        {
          provide: CasesService,
          useValue: {
            casesResource: { value: cases, isLoading, error, reload },
          },
        },
      ],
    }).compileComponents();
  });

  it('renders loading without reading case-dependent views', () => {
    isLoading.set(true);
    const { compiled } = renderPage();

    expect(metricText(compiled, 'cases-loading')).toContain('Loading cases');
    expect(elements(compiled, 'open-cases-count')).toHaveLength(0);
    expect(elements(compiled, 'case-list')).toHaveLength(0);
  });

  it('renders an error and reloads the resource on retry', () => {
    error.set(new Error('Service unavailable'));
    const { fixture, compiled } = renderPage();

    expect(metricText(compiled, 'cases-error')).toContain('Cases could not be loaded');
    expect(elements(compiled, 'open-cases-count')).toHaveLength(0);

    button(compiled, 'reload-cases').click();
    fixture.detectChanges();

    expect(reload).toHaveBeenCalledOnce();
  });

  it('renders a dedicated empty state when the data source returns no cases', () => {
    cases.set([]);
    const { compiled } = renderPage();

    expect(metricText(compiled, 'empty-case-register')).toContain('No operational cases');
    expect(elements(compiled, 'empty-case-list')).toHaveLength(0);
  });

  it('derives the initial operational metrics from the loaded case state', () => {
    const { compiled } = renderPage();

    expect(metricText(compiled, 'open-cases-count')).toBe('2');
    expect(metricText(compiled, 'review-queue-count')).toBe('1');
    expect(metricText(compiled, 'sla-risk-count')).toBe('1');
    expect(elements(compiled, 'reconciliation-case-card')).toHaveLength(4);
    expect(
      requiredElement<HTMLAnchorElement>(compiled, 'case-details-link').getAttribute('href'),
    ).toBe('/cases/CASE-1001');
  });

  it('recomputes the open count when an incoming case is registered', () => {
    const { fixture, compiled } = renderPage();

    button(compiled, 'register-case').click();
    fixture.detectChanges();

    expect(metricText(compiled, 'open-cases-count')).toBe('3');
    expect(metricText(compiled, 'review-queue-count')).toBe('1');
    expect(metricText(compiled, 'sla-risk-count')).toBe('1');
  });

  it('moves open cases to review without changing the SLA risk rule', () => {
    const { fixture, compiled } = renderPage();
    const moveButton = button(compiled, 'move-case-to-review');

    moveButton.click();
    fixture.detectChanges();

    expect(metricText(compiled, 'open-cases-count')).toBe('1');
    expect(metricText(compiled, 'review-queue-count')).toBe('2');
    expect(metricText(compiled, 'sla-risk-count')).toBe('1');

    moveButton.click();
    moveButton.click();
    fixture.detectChanges();

    expect(metricText(compiled, 'open-cases-count')).toBe('0');
    expect(metricText(compiled, 'review-queue-count')).toBe('3');
  });

  it('commits the search model and derives the matching case count', () => {
    const { fixture, compiled } = renderPage();
    const searchInput = requiredElement<HTMLInputElement>(compiled, 'case-search-input');
    const searchForm = requiredElement<HTMLFormElement>(compiled, 'case-search-form');

    expect(metricText(compiled, 'case-search-summary')).toBe('4 total cases');

    searchInput.value = '1001';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));

    expect(metricText(compiled, 'case-search-summary')).toBe('4 total cases');

    searchForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(metricText(compiled, 'case-search-summary')).toBe('1 matching case');
    expect(elements(compiled, 'reconciliation-case-card')).toHaveLength(1);
    expect(elements(compiled, 'reconciliation-case-card')[0]?.textContent).toContain(
      'TXN-2026-001',
    );

    button(compiled, 'clear-search').click();
    fixture.detectChanges();

    expect(metricText(compiled, 'case-search-summary')).toBe('4 total cases');
    expect(elements(compiled, 'reconciliation-case-card')).toHaveLength(4);
  });

  it('renders the search empty state when loaded cases do not match the query', () => {
    const { fixture, compiled } = renderPage();
    const searchInput = requiredElement<HTMLInputElement>(compiled, 'case-search-input');
    const searchForm = requiredElement<HTMLFormElement>(compiled, 'case-search-form');

    searchInput.value = 'missing-case';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    searchForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(elements(compiled, 'reconciliation-case-card')).toHaveLength(0);
    expect(metricText(compiled, 'empty-case-list')).toContain('No matching cases');
    expect(elements(compiled, 'empty-case-register')).toHaveLength(0);
  });
});

function renderPage(): {
  fixture: ReturnType<typeof TestBed.createComponent<CasesPage>>;
  compiled: HTMLElement;
} {
  const fixture = TestBed.createComponent(CasesPage);
  fixture.detectChanges();

  return { fixture, compiled: fixture.nativeElement as HTMLElement };
}

function metricText(element: HTMLElement, testId: string): string | undefined {
  return element.querySelector(`[data-testid="${testId}"]`)?.textContent?.trim();
}

function button(element: HTMLElement, testId: string): HTMLButtonElement {
  return requiredElement<HTMLButtonElement>(element, testId);
}

function elements(element: HTMLElement, testId: string): Element[] {
  return Array.from(element.querySelectorAll(`[data-testid="${testId}"]`));
}

function requiredElement<T extends Element>(element: HTMLElement, testId: string): T {
  const target = element.querySelector<T>(`[data-testid="${testId}"]`);

  if (!target) {
    throw new Error(`Element with test id "${testId}" was not found.`);
  }

  return target;
}
