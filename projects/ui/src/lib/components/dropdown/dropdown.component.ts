import { A11yModule } from '@angular/cdk/a11y';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconName } from 'angular-remix-icon/lib/icon-names';
import { ButtonComponent, ButtonVariant } from '../button/button.component';

@Component({
  selector: 'ui-dropdown',
  template: `
    <div class="w-full">
      <div [cdkMenuTriggerFor]="menu">
        <ng-content></ng-content>
      </div>
      <ng-template #menu>
        <div
          class="w-full rounded-xl shadow-xl border border-gray-200 min-w-[150px]"
          cdkMenu
        >
          @for (option of this.options; track option) {
            <ui-button
              contentAlignment="left"
              [label]="option.label"
              [variant]="option.variant ?? 'plain'"
              [trailingIcon]="option.trailingIcon"
              [prefixIcon]="option.prefixIcon"
              (click)="this.optionClick.emit(option)"
              cdkMenuItem
            ></ui-button>
          }
        </div>
      </ng-template>
    </div>
  `,
  styles: `
  :host {
    display: block;
    width: fit-content;
  }
  `,
  standalone: true,
  imports: [CdkMenu, CdkMenuItem, CdkMenuTrigger, ButtonComponent, A11yModule],
})
export class DropdownComponent {
  @Input()
  public options: DropdownOption[] = [];

  @Output()
  public optionClick: EventEmitter<DropdownOption> = new EventEmitter();
}

export interface DropdownOption {
  label: string;
  trailingIcon?: IconName;
  prefixIcon?: IconName;
  variant?: ButtonVariant;
}
