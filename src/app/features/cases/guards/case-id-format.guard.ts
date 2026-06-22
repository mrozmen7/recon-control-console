import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

const CASE_ID_PATTERN = /^CASE-\d+$/;

export const caseIdFormatGuard: CanActivateFn = (route) => {
  const caseId = route.paramMap.get('caseId');

  if (caseId && CASE_ID_PATTERN.test(caseId)) {
    return true;
  }

  return inject(Router).createUrlTree(['/cases']);
};
