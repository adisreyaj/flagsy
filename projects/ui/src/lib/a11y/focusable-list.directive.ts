import { FocusKeyManager } from '@angular/cdk/a11y';
import {
  AfterContentInit,
  booleanAttribute,
  ContentChildren,
  Directive,
  HostBinding,
  HostListener,
  Input,
  QueryList,
} from '@angular/core';
import { FocusableDirective } from './focusable.directive';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[focusableList]',
  standalone: true,
})
export class FocusableListDirective implements AfterContentInit {
  @Input({ transform: booleanAttribute })
  public navigateWithHomeAndEnd: boolean = true;

  @Input({ transform: booleanAttribute })
  public navigateWithPageUpDown: boolean = true;

  @Input({ transform: booleanAttribute })
  public shouldWrap: boolean = false;

  @Input()
  public orientation: FocusableListOrientation =
    FocusableListOrientation.Vertical;

  @ContentChildren(FocusableDirective, { descendants: true })
  public listItems?: QueryList<FocusableDirective>;

  @HostBinding('attr.tabindex')
  @Input()
  public customTabIndex: number = -1;

  @HostListener('keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent): void {
    this.keyManager?.onKeydown(event);
  }

  public keyManager?: FocusKeyManager<FocusableDirective>;

  public ngAfterContentInit(): void {
    if (this.listItems) {
      this.keyManager = new FocusKeyManager(this.listItems)
        .withHorizontalOrientation(
          this.orientation === FocusableListOrientation.Horizontal
            ? 'ltr'
            : null,
        )
        .withVerticalOrientation(
          this.orientation === FocusableListOrientation.Vertical,
        )
        .withPageUpDown(this.navigateWithPageUpDown)
        .withHomeAndEnd(this.navigateWithHomeAndEnd)
        .withWrap(this.shouldWrap);
    }
  }
}

export const enum FocusableListOrientation {
  Horizontal = 'horizontal',
  Vertical = 'vertical',
  Both = 'both',
}
