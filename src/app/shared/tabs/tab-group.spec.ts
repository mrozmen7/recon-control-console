import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { InteractionLoggerService } from '../../core/logging/interaction-logger.service';
import { TabGroup } from './tab-group';
import { TabPanel } from './tab-panel';

@Component({
  imports: [TabGroup, TabPanel],
  template: `
    <app-tab-group ariaLabel="Example tabs">
      <app-tab-panel title="First" value="first">
        <p data-testid="first-panel">First content</p>
      </app-tab-panel>

      <app-tab-panel title="Second" value="second">
        <p data-testid="second-panel">Second content</p>
      </app-tab-panel>
    </app-tab-group>
  `,
})
class TabGroupHost {}

describe('TabGroup', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabGroupHost],
    }).compileComponents();

    TestBed.inject(InteractionLoggerService).clear();
  });

  it('activates the first projected tab panel by default', () => {
    const fixture = renderHost();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(text(compiled, 'first-panel')).toContain('First content');
    expect(text(compiled, 'second-panel')).toBeUndefined();
  });

  it('switches projected panel content when a tab is selected', () => {
    const fixture = renderHost();
    const compiled = fixture.nativeElement as HTMLElement;

    buttonByText(compiled, 'Second').click();
    fixture.detectChanges();

    expect(text(compiled, 'first-panel')).toBeUndefined();
    expect(text(compiled, 'second-panel')).toContain('Second content');
  });
});

function renderHost(): ReturnType<typeof TestBed.createComponent<TabGroupHost>> {
  const fixture = TestBed.createComponent(TabGroupHost);
  fixture.detectChanges();

  return fixture;
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
