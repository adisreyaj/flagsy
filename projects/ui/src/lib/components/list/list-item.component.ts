import { Component } from '@angular/core';
import { FocusableDirective } from '@ui/a11y';

@Component({
  selector: 'ui-list-item',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class ListItemComponent extends FocusableDirective {}
