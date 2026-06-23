import { Injectable } from '@angular/core';
import { delay, mergeMap, Observable, of, throwError, timer } from 'rxjs';

interface ReviewQueueActionOptions {
  readonly shouldFail?: boolean;
}

@Injectable()
export class ReviewQueueApiService {
  approveCase(
    caseId: string,
    options: ReviewQueueActionOptions = {},
  ): Observable<{ readonly caseId: string }> {
    if (options.shouldFail) {
      return timer(450).pipe(
        mergeMap(() => throwError(() => new Error(`Approval failed for ${caseId}`))),
      );
    }

    return of({ caseId }).pipe(delay(450));
  }
}
