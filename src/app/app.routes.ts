import { Routes } from '@angular/router';
import { CasesPage } from './features/cases/cases-page';
import { CreateCasePage } from './features/create-case/create-case-page';
import { ReviewQueuePage } from './features/review-queue/review-queue-page';

export const routes: Routes = [
  { path: '', redirectTo: 'cases', pathMatch: 'full' },
  { path: 'cases', component: CasesPage },
  { path: 'cases/new', component: CreateCasePage },
  { path: 'queue', component: ReviewQueuePage },
  { path: '**', redirectTo: 'cases' },
];
