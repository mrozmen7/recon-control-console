import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';
import { CaseDetailPage } from './features/cases/case-detail/case-detail-page';
import { CasesPage } from './features/cases/cases-page';
import { CasesService } from './features/cases/data-access/cases.service';
import type { ReconciliationCase } from './features/cases/model/reconciliation-case';
import { CreateCasePage } from './features/create-case/create-case-page';

const ROUTED_CASES: ReconciliationCase[] = [
  {
    id: 'CASE-1001',
    reference: 'TXN-2026-001',
    status: 'OPEN',
    slaHoursRemaining: 2,
  },
];

describe('application routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes, withComponentInputBinding()),
        {
          provide: CasesService,
          useValue: {
            casesResource: {
              value: signal(structuredClone(ROUTED_CASES)),
              isLoading: signal(false),
              error: signal<unknown | undefined>(undefined),
              reload: () => true,
            },
          },
        },
      ],
    });
  });

  it('binds the dynamic caseId route parameter to the detail input', async () => {
    const harness = await RouterTestingHarness.create();
    const detailPage = await harness.navigateByUrl('/cases/CASE-1001', CaseDetailPage);

    expect(detailPage.caseId()).toBe('CASE-1001');
    expect(harness.routeNativeElement?.textContent).toContain('TXN-2026-001');
  });

  it('matches the static create route before the dynamic case route', async () => {
    const harness = await RouterTestingHarness.create();

    await harness.navigateByUrl('/cases/new', CreateCasePage);

    expect(harness.routeNativeElement?.textContent).toContain('Create reconciliation case');
  });

  it('redirects an invalid case id before activating the detail page', async () => {
    const harness = await RouterTestingHarness.create();
    const router = TestBed.inject(Router);

    await harness.navigateByUrl('/cases/not-a-case', CasesPage);

    expect(router.url).toBe('/cases');
    expect(harness.routeNativeElement?.textContent).toContain('Reconciliation cases');
  });
});
