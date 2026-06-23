import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { ReconciliationCase } from '../model/reconciliation-case';
import { CasesService } from './cases.service';

const CASES_URL = 'mock-data/reconciliation-cases.json';
const API_CASES: ReconciliationCase[] = [
  {
    id: 'CASE-1001',
    reference: 'TXN-2026-001',
    status: 'OPEN',
    slaHoursRemaining: 2,
  },
];

describe('CasesService', () => {
  let httpTesting: HttpTestingController;
  let applicationRef: ApplicationRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    httpTesting = TestBed.inject(HttpTestingController);
    applicationRef = TestBed.inject(ApplicationRef);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('loads reconciliation cases with a GET request', async () => {
    const service = TestBed.inject(CasesService);
    TestBed.tick();

    const request = httpTesting.expectOne(CASES_URL);
    expect(request.request.method).toBe('GET');

    request.flush(API_CASES);
    await applicationRef.whenStable();

    expect(service.casesResource.value()).toEqual(API_CASES);
    expect(service.casesResource.isLoading()).toBe(false);
    expect(service.casesResource.error()).toBeUndefined();
  });

  it('preserves an empty successful response as an empty collection', async () => {
    const service = TestBed.inject(CasesService);
    TestBed.tick();

    httpTesting.expectOne(CASES_URL).flush([]);
    await applicationRef.whenStable();

    expect(service.casesResource.value()).toEqual([]);
    expect(service.casesResource.error()).toBeUndefined();
  });

  it('exposes an HTTP failure and can reload successfully', async () => {
    const service = TestBed.inject(CasesService);
    TestBed.tick();

    httpTesting
      .expectOne(CASES_URL)
      .flush('Service unavailable', { status: 503, statusText: 'Service Unavailable' });
    await applicationRef.whenStable();

    expect(service.casesResource.error()).toBeDefined();
    expect(service.casesResource.reload()).toBe(true);

    TestBed.tick();
    httpTesting.expectOne(CASES_URL).flush(API_CASES);
    await applicationRef.whenStable();

    expect(service.casesResource.value()).toEqual(API_CASES);
    expect(service.casesResource.error()).toBeUndefined();
  });
});
