import { Directive, HostListener, inject, input } from '@angular/core';
import { InteractionLoggerService } from '../../core/logging/interaction-logger.service';

@Directive({
  selector: '[appClickLogger]',
})
export class ClickLoggerDirective {
  readonly action = input('interaction', { alias: 'appClickLogger' });
  readonly metadata = input<Readonly<Record<string, unknown>>>(
    {},
    { alias: 'appClickLoggerMetadata' },
  );

  private readonly logger = inject(InteractionLoggerService);

  @HostListener('click')
  protected logClick(): void {
    this.logger.log(this.action(), this.metadata());
  }
}
