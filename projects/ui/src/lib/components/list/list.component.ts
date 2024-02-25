import { FocusKeyManager } from '@angular/cdk/a11y';
import { Component, ContentChildren, QueryList } from '@angular/core';
import { ListItemComponent } from './list-item.component';

@Component({
  selector: 'ui-list',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class ListComponent {
  @ContentChildren(ListItemComponent)
  public items?: QueryList<ListItemComponent>;

  #keyManager?: FocusKeyManager<unknown>;
}
