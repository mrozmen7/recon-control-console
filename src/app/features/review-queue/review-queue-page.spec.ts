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

  it('renders injected config, store state, and page-scoped session state', () => {
    const { compiled } = renderPage();

    expect(compiled.textContent).toContain('Recon Control Console');
    expect(text(compiled, 'resolved-count')).toBe('0');
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

  it('moves a case optimistically into resolved state', () => {
    const { fixture, compiled } = renderPage();

    buttonByText(compiled, 'Approve').click();
    fixture.detectChanges();

    expect(text(compiled, 'session-action-count')).toBe('1');
    expect(text(compiled, 'resolved-count')).toBe('1');
    expect(text(compiled, 'action-in-flight')).toContain('CASE-1002');
    expect(text(compiled, 'ready-empty')).toContain('No cases ready for review');
  });

  it('renders the deferred audit placeholder before the panel enters the viewport', () => {
    const { compiled } = renderPage();

    expect(text(compiled, 'audit-placeholder')).toContain('deferred until it enters the viewport');
  });

  it('rolls back a simulated approval failure', async () => {
    const { fixture, compiled } = renderPage();

    buttonByText(compiled, 'Simulate next failure').click();
    buttonByText(compiled, 'Escalations').click();
    fixture.detectChanges();

    buttonByText(compiled, 'Approve escalation').click();
    fixture.detectChanges();

    expect(text(compiled, 'escalations-empty')).toContain('No escalations');

    await new Promise((resolve) => setTimeout(resolve, 520));
    fixture.detectChanges();

    expect(text(compiled, 'rollback-alert')).toContain('Approval failed for CASE-1005');
    expect(text(compiled, 'escalations-panel')).toContain('TXN-2026-005');
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
