import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './header';

@Component({
  selector: 'app-shell',
  imports: [Header, RouterOutlet],
  template: `
    <div class="shell">
      <app-header [title]="title()" phaseLabel="Phase 7: Control Flow" />

      <main class="main">
        <router-outlet />
      </main>
    </div>
  `,
  styleUrl: './app-shell.css',
})
export class AppShell {
  protected readonly title = signal('Recon Control Console');
}
