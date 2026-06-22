import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import type { ReconciliationCase } from '../model/reconciliation-case';
import { CasesService } from '../data-access/cases.service';
import { CaseDetailPage } from './case-detail-page';

const CASES: ReconciliationCase[] = [
  {
    id: 'CASE-1001',
    reference: 'TXN-2026-001',
    status: 'OPEN',
    slaHoursRemaining: 2,
  },
];

describe('CaseDetailPage', () => {
  const cases = signal<ReconciliationCase[]>([]);
  const isLoading = signal(false);
  const error = signal<unknown | undefined>(undefined);
  const reload = vi.fn();

  beforeEach(async () => {
    cases.set(structuredClone(CASES));
    isLoading.set(false);
    error.set(undefined);
    reload.mockReset();

    await TestBed.configureTestingModule({
      imports: [CaseDetailPage],
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

  it('selects the case reactively from the caseId input', () => {
    const { compiled } = renderDetail('CASE-1001');

    expect(testIdText(compiled, 'case-detail')).toContain('TXN-2026-001');
    expect(compiled.querySelector('h1')?.textContent).toContain('CASE-1001');
  });

  it('renders loading without reading case data', () => {
    isLoading.set(true);
    const { compiled } = renderDetail('CASE-1001');

    expect(testIdText(compiled, 'case-detail-loading')).toContain('Loading case');
    expect(compiled.querySelector('[data-testid="case-detail"]')).toBeNull();
  });

  it('renders an error and reloads the shared resource', () => {
    error.set(new Error('Service unavailable'));
    const { fixture, compiled } = renderDetail('CASE-1001');

    requiredElement<HTMLButtonElement>(compiled, 'reload-case-detail').click();
    fixture.detectChanges();

    expect(testIdText(compiled, 'case-detail-error')).toContain('Case could not be loaded');
    expect(reload).toHaveBeenCalledOnce();
  });

  it('renders not found for a valid case id absent from the payload', () => {
    const { compiled } = renderDetail('CASE-9999');

    expect(testIdText(compiled, 'case-detail-not-found')).toContain('Case not found');
    expect(testIdText(compiled, 'case-detail-not-found')).toContain('CASE-9999');
  });
});

function renderDetail(caseId: string) {
  const fixture = TestBed.createComponent(CaseDetailPage);
  fixture.componentRef.setInput('caseId', caseId);
  fixture.detectChanges();

  return { fixture, compiled: fixture.nativeElement as HTMLElement };
}

function testIdText(element: HTMLElement, testId: string): string | undefined {
  return element.querySelector(`[data-testid="${testId}"]`)?.textContent?.trim();
}

function requiredElement<T extends Element>(element: HTMLElement, testId: string): T {
  const target = element.querySelector<T>(`[data-testid="${testId}"]`);

  if (!target) {
    throw new Error(`Element with test id "${testId}" was not found.`);
  }

  return target;
}
