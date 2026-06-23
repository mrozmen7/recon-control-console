import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { ReconciliationCase } from '../model/reconciliation-case';

@Injectable({
  providedIn: 'root',
})
export class CasesService {
  readonly casesResource = httpResource<ReconciliationCase[]>(
    () => 'mock-data/reconciliation-cases.json',
    {
      defaultValue: [],
      debugName: 'casesResource',
    },
  );
}
