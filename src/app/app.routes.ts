import { Routes } from '@angular/router';
import { CasesPage } from './features/cases/cases-page';
import { caseIdFormatGuard } from './features/cases/guards/case-id-format.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'cases', pathMatch: 'full' },
  {
    path: 'cases/new',
    title: 'Create case | Recon Control Console',
    loadComponent: () =>
      import('./features/create-case/create-case-page').then((module) => module.CreateCasePage),
  },
  {
    path: 'cases/:caseId',
    title: 'Case details | Recon Control Console',
    canActivate: [caseIdFormatGuard],
    loadComponent: () =>
      import('./features/cases/case-detail/case-detail-page').then(
        (module) => module.CaseDetailPage,
      ),
  },
  { path: 'cases', title: 'Cases | Recon Control Console', component: CasesPage },
  {
    path: 'queue',
    title: 'Review queue | Recon Control Console',
    loadComponent: () =>
      import('./features/review-queue/review-queue-page').then((module) => module.ReviewQueuePage),
  },
  { path: '**', redirectTo: 'cases' },
];
