import { TestBed } from '@angular/core/testing';
import { CreateCasePage } from './create-case-page';

describe('CreateCasePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCasePage],
    }).compileComponents();
  });

  it('shows validation errors when an empty form is submitted', async () => {
    const { fixture, compiled } = renderPage();

    form(compiled).dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(text(compiled, 'form-invalid-alert')).toContain('validation issues');
    expect(text(compiled, 'reference-errors')).toContain('Transaction reference is required');
    expect(text(compiled, 'owner-errors')).toContain('Owner is required');
    expect(text(compiled, 'description-errors')).toContain('Exception summary is required');
  });

  it('creates a local case draft when a valid form is submitted', async () => {
    const { fixture, compiled } = renderPage();

    await fillValidCase(compiled, fixture);
    form(compiled).dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(text(compiled, 'created-case')).toContain('CASE-2001 registered');
    expect(text(compiled, 'created-case-list')).toContain('TXN-2026-005');
    expect(text(compiled, 'created-case-empty')).toBeUndefined();
    expect(input(compiled, 'case-reference').value).toBe('');
  });

  it('enables manager review only for critical priority cases', async () => {
    const { fixture, compiled } = renderPage();
    const managerReview = input(compiled, 'manager-review');

    expect(managerReview.disabled).toBe(true);

    select(compiled, 'case-priority', 'CRITICAL');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(input(compiled, 'manager-review').disabled).toBe(false);
  });

  it('requires manager review confirmation for critical priority cases', async () => {
    const { fixture, compiled } = renderPage();

    await fillValidCase(compiled, fixture);
    select(compiled, 'case-priority', 'CRITICAL');
    fixture.detectChanges();

    form(compiled).dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(text(compiled, 'manager-review-errors')).toContain(
      'Critical cases require manager review confirmation',
    );

    input(compiled, 'manager-review').click();
    fixture.detectChanges();

    form(compiled).dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(text(compiled, 'created-case')).toContain('CASE-2001 registered');
  });
});

function renderPage(): {
  fixture: ReturnType<typeof TestBed.createComponent<CreateCasePage>>;
  compiled: HTMLElement;
} {
  const fixture = TestBed.createComponent(CreateCasePage);
  fixture.detectChanges();

  return { fixture, compiled: fixture.nativeElement as HTMLElement };
}

async function fillValidCase(
  compiled: HTMLElement,
  fixture: ReturnType<typeof TestBed.createComponent<CreateCasePage>>,
): Promise<void> {
  writeToInput(compiled, 'case-reference', 'TXN-2026-005');
  writeToInput(compiled, 'case-owner', 'Operations analyst');
  writeToInput(compiled, 'case-sla', '6');
  writeToInput(compiled, 'case-description', 'Payment amount mismatch requires review.');

  await new Promise((resolve) => setTimeout(resolve, 300));
  fixture.detectChanges();
}

function form(element: HTMLElement): HTMLFormElement {
  return requiredElement<HTMLFormElement>(element, 'create-case-form');
}

function input(element: HTMLElement, testId: string): HTMLInputElement {
  return requiredElement<HTMLInputElement>(element, testId);
}

function writeToInput(element: HTMLElement, testId: string, value: string): void {
  const target = requiredElement<HTMLInputElement | HTMLTextAreaElement>(element, testId);

  target.value = value;
  target.dispatchEvent(new Event('input', { bubbles: true }));
}

function select(element: HTMLElement, testId: string, value: string): void {
  const target = requiredElement<HTMLSelectElement>(element, testId);

  target.value = value;
  target.dispatchEvent(new Event('input', { bubbles: true }));
  target.dispatchEvent(new Event('change', { bubbles: true }));
}

function text(element: HTMLElement, testId: string): string | undefined {
  return element.querySelector(`[data-testid="${testId}"]`)?.textContent?.trim();
}

function requiredElement<T extends Element>(element: HTMLElement, testId: string): T {
  const target = element.querySelector<T>(`[data-testid="${testId}"]`);

  if (!target) {
    throw new Error(`Element with test id "${testId}" was not found.`);
  }

  return target;
}
