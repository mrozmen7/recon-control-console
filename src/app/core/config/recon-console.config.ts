import { InjectionToken } from '@angular/core';

export interface ReconConsoleConfig {
  readonly productName: string;
  readonly auditEnabled: boolean;
  readonly reviewSlaRiskHours: number;
}

export const RECON_CONSOLE_CONFIG = new InjectionToken<ReconConsoleConfig>('recon.console.config', {
  providedIn: 'root',
  factory: () => ({
    productName: 'Recon Control Console',
    auditEnabled: true,
    reviewSlaRiskHours: 4,
  }),
});
