import { Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-tab-panel',
  template: `
    @if (active()) {
      <section
        class="tab-panel"
        role="tabpanel"
        [id]="panelId()"
        [attr.aria-labelledby]="tabId()"
        data-testid="tab-panel"
      >
        <ng-content />
      </section>
    }
  `,
})
export class TabPanel {
  readonly title = input.required<string>();
  readonly value = input.required<string>();
  readonly active = signal(false);

  readonly tabId = computed(() => `${this.value()}-tab`);
  readonly panelId = computed(() => `${this.value()}-panel`);

  setActive(isActive: boolean): void {
    this.active.set(isActive);
  }
}
