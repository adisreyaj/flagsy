import { Component, contentChildren } from '@angular/core';
import { ListItemComponent } from './list-item.component';

@Component({
  selector: 'ui-list',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class ListComponent {
  public items = contentChildren(ListItemComponent);
}
