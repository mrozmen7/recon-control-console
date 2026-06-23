import { Injectable, signal } from '@angular/core';

@Injectable()
export class ReviewQueueSessionService {
  readonly sessionId = `RQ-${Math.floor(1000 + Math.random() * 9000)}`;
  readonly actionCount = signal(0);

  recordAction(): void {
    this.actionCount.update((currentCount) => currentCount + 1);
  }
}
