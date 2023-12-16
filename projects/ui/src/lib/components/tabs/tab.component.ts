import {
  booleanAttribute,
  Component,
  Input,
  TemplateRef,
  ViewChild,
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
  @ViewChild('content', { static: true, read: TemplateRef })
  public content!: TemplateRef<unknown>;

  @Input()
  title?: string;

  @Input()
  icon?: IconName;

  @Input({ transform: booleanAttribute })
  disabled?: boolean;
}
