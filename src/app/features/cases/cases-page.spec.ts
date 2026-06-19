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
});

function metricText(element: HTMLElement, testId: string): string | undefined {
  return element.querySelector(`[data-testid="${testId}"]`)?.textContent?.trim();
}

function button(element: HTMLElement, testId: string): HTMLButtonElement {
  const target = element.querySelector<HTMLButtonElement>(`[data-testid="${testId}"]`);

  if (!target) {
    throw new Error(`Button with test id "${testId}" was not found.`);
  }

  return target;
}
