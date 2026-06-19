import { TestBed } from '@angular/core/testing';
import { CasesPage } from './cases-page';

describe('CasesPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasesPage],
    }).compileComponents();
  });

  it('derives the initial operational metrics from the case state', () => {
    const fixture = TestBed.createComponent(CasesPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(metricText(compiled, 'open-cases-count')).toBe('2');
    expect(metricText(compiled, 'review-queue-count')).toBe('1');
    expect(metricText(compiled, 'sla-risk-count')).toBe('1');
    expect(elements(compiled, 'reconciliation-case-card')).toHaveLength(4);
  });

  it('recomputes the open count when an incoming case is registered', () => {
    const fixture = TestBed.createComponent(CasesPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const registerButton = button(compiled, 'register-case');

    registerButton.click();
    fixture.detectChanges();

    expect(metricText(compiled, 'open-cases-count')).toBe('3');
    expect(metricText(compiled, 'review-queue-count')).toBe('1');
    expect(metricText(compiled, 'sla-risk-count')).toBe('1');
  });

  it('moves open cases to review without changing the SLA risk rule', () => {
    const fixture = TestBed.createComponent(CasesPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
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
    const fixture = TestBed.createComponent(CasesPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
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

  it('renders the empty branch when no cases match the committed query', () => {
    const fixture = TestBed.createComponent(CasesPage);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const searchInput = requiredElement<HTMLInputElement>(compiled, 'case-search-input');
    const searchForm = requiredElement<HTMLFormElement>(compiled, 'case-search-form');

    searchInput.value = 'missing-case';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    searchForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(elements(compiled, 'reconciliation-case-card')).toHaveLength(0);
    expect(metricText(compiled, 'empty-case-list')).toContain('No matching cases');
  });
});

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
