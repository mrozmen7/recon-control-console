import { TestBed } from '@angular/core/testing';
import { InteractionLoggerService } from '../../core/logging/interaction-logger.service';
import { ReviewQueuePage } from './review-queue-page';

describe('ReviewQueuePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewQueuePage],
    }).compileComponents();

    TestBed.inject(InteractionLoggerService).clear();
  });

  it('renders injected config and scoped session state', () => {
    const { compiled } = renderPage();

    expect(compiled.textContent).toContain('Recon Control Console');
    expect(text(compiled, 'session-id')).toContain('RQ-');
    expect(text(compiled, 'session-action-count')).toBe('0');
  });

  it('uses projected tab panels for queue workspaces', () => {
    const { fixture, compiled } = renderPage();

    expect(text(compiled, 'ready-panel')).toContain('TXN-2026-002');
    expect(text(compiled, 'escalations-panel')).toBeUndefined();

    buttonByText(compiled, 'Escalations').click();
    fixture.detectChanges();

    expect(text(compiled, 'ready-panel')).toBeUndefined();
    expect(text(compiled, 'escalations-panel')).toContain('TXN-2026-005');
  });

  it('records review actions with the shared click logger directive', () => {
    const { fixture, compiled } = renderPage();

    expect(text(compiled, 'audit-empty')).toContain('No interactions captured');

    buttonByText(compiled, 'Assign review').click();
    fixture.detectChanges();

    expect(text(compiled, 'session-action-count')).toBe('1');
    expect(text(compiled, 'audit-list')).toContain('review-queue.assign');
  });
});

function renderPage(): {
  fixture: ReturnType<typeof TestBed.createComponent<ReviewQueuePage>>;
  compiled: HTMLElement;
} {
  const fixture = TestBed.createComponent(ReviewQueuePage);
  fixture.detectChanges();

  return { fixture, compiled: fixture.nativeElement as HTMLElement };
}

function buttonByText(element: HTMLElement, label: string): HTMLButtonElement {
  const target = Array.from(element.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  );

  if (!target) {
    throw new Error(`Button "${label}" was not found.`);
  }

  return target;
}

function text(element: HTMLElement, testId: string): string | undefined {
  return element.querySelector(`[data-testid="${testId}"]`)?.textContent?.trim();
}
