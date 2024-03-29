import {
  booleanAttribute,
  Component,
  input,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { IconName } from 'angular-remix-icon/lib/icon-names';

@Component({
  selector: 'ui-tab',
  template: `<ng-template #content>
    <ng-content></ng-content>
  </ng-template>`,
  standalone: true,
})
export class TabComponent {
  public content = viewChild<TemplateRef<unknown>>('content');

  public title = input<string>('');

  public icon = input<IconName>();

  public disabled = input<boolean | string, boolean>(false, {
    transform: booleanAttribute,
  });
}
