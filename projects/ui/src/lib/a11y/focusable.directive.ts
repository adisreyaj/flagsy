import { FocusableOption } from '@angular/cdk/a11y';
import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[focusable]',
  standalone: true,
})
export class FocusableDirective implements FocusableOption {
  readonly #elementRef = inject<ElementRef<HTMLDListElement>>(ElementRef);

  public focus(): void {
    this.#elementRef.nativeElement.focus();
  }
}
