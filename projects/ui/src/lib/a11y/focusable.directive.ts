import { FocusableOption } from '@angular/cdk/a11y';
import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[focusable]',
  standalone: true,
})
export class FocusableDirective implements FocusableOption {
  @Input()
  public label?: string;

  @Input()
  public disabled?: boolean;

  @Input()
  public customTabIndex: number = -1;

  /**
   * We don't want individual list items to be navigable by tabbing, Instead
   * user will be using arrow keys to navigate through the list items.
   *
   * Tabbing will focus the next focusable element in the DOM.
   */
  @HostBinding('attr.tabindex')
  public get tabIndex() {
    return this.customTabIndex;
  }

  public constructor(private readonly el: ElementRef<HTMLElement>) {}

  public focus(): void {
    this.el.nativeElement?.focus();
  }
}
