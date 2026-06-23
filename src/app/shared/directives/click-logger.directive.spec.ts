import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { InteractionLoggerService } from '../../core/logging/interaction-logger.service';
import { ClickLoggerDirective } from './click-logger.directive';

@Component({
  imports: [ClickLoggerDirective],
  template: `
    <button
      type="button"
      [appClickLogger]="'spec.clicked'"
      [appClickLoggerMetadata]="{ source: 'directive-test' }"
      data-testid="tracked-button"
    >
      Track
    </button>
  `,
})
class ClickLoggerHost {}

describe('ClickLoggerDirective', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClickLoggerHost],
    }).compileComponents();

    TestBed.inject(InteractionLoggerService).clear();
  });

  it('records a log entry when the host element is clicked', () => {
    const fixture = TestBed.createComponent(ClickLoggerHost);
    const logger = TestBed.inject(InteractionLoggerService);
    fixture.detectChanges();

    requiredElement<HTMLButtonElement>(fixture.nativeElement, 'tracked-button').click();
    fixture.detectChanges();

    expect(logger.totalCount()).toBe(1);
    expect(logger.recentEntries()[0]?.action).toBe('spec.clicked');
    expect(logger.recentEntries()[0]?.metadata['source']).toBe('directive-test');
  });
});

function requiredElement<T extends Element>(element: HTMLElement, testId: string): T {
  const target = element.querySelector<T>(`[data-testid="${testId}"]`);

  if (!target) {
    throw new Error(`Element with test id "${testId}" was not found.`);
  }

  return target;
}
