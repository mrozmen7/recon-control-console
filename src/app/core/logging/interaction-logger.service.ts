import { computed, inject, Injectable, signal } from '@angular/core';
import { RECON_CONSOLE_CONFIG } from '../config/recon-console.config';

export interface InteractionLogEntry {
  readonly action: string;
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class InteractionLoggerService {
  private readonly config = inject(RECON_CONSOLE_CONFIG);
  private readonly entries = signal<InteractionLogEntry[]>([]);

  readonly recentEntries = computed(() => this.entries().slice(0, 5));
  readonly totalCount = computed(() => this.entries().length);

  log(action: string, metadata: Readonly<Record<string, unknown>> = {}): void {
    if (!this.config.auditEnabled) {
      return;
    }

    const entry: InteractionLogEntry = {
      action,
      metadata,
      timestamp: new Date().toISOString(),
    };

    this.entries.update((currentEntries) => [entry, ...currentEntries]);
  }

  clear(): void {
    this.entries.set([]);
  }
}
