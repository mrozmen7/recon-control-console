import { Component } from '@angular/core';
import { AppShell } from './layout/app-shell';

@Component({
  selector: 'app-root',
  imports: [AppShell],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
