import { AfterContentInit, Component, contentChildren, input, signal } from '@angular/core';
import { ClickLoggerDirective } from '../directives/click-logger.directive';
import { TabPanel } from './tab-panel';

@Component({
  selector: 'app-tab-group',
  hostDirectives: [ClickLoggerDirective],
  template: `
    <div class="tab-list" role="tablist" [attr.aria-label]="ariaLabel()">
      @for (panel of panels(); track panel.value()) {
        <button
          type="button"
          role="tab"
          [id]="panel.tabId()"
          [class.active]="panel.active()"
          [attr.aria-controls]="panel.panelId()"
          [attr.aria-selected]="panel.active()"
          (click)="select(panel.value())"
        >
          {{ panel.title() }}
        </button>
      }
    </div>

    <ng-content />
  `,
  styleUrl: './tab-group.css',
})
export class TabGroup implements AfterContentInit {
  readonly ariaLabel = input('Tabbed content');
  readonly panels = contentChildren(TabPanel);

  protected readonly selectedValue = signal<string | undefined>(undefined);

  ngAfterContentInit(): void {
    const firstPanel = this.panels()[0];

    if (firstPanel) {
      this.select(firstPanel.value());
    }
  }

  select(value: string): void {
    this.selectedValue.set(value);

    for (const panel of this.panels()) {
      panel.setActive(panel.value() === value);
    }
  }
}
