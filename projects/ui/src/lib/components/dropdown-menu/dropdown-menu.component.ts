import { A11yModule } from '@angular/cdk/a11y';
import {
  CdkMenu,
  CdkMenuItem,
  CdkMenuTrigger,
  CdkTargetMenuAim,
} from '@angular/cdk/menu';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { FocusableDirective } from '@ui/a11y';
import { IconName } from 'angular-remix-icon/lib/icon-names';
import { ButtonComponent, ButtonVariant } from '../button/button.component';

@Component({
  selector: 'ui-dropdown-menu',
  template: `
    <div class="w-full">
      <div [cdkMenuTriggerFor]="menu">
        <ng-content></ng-content>
      </div>
      <ng-template #menu>
        <div
          cdkMenu
          class="rounded-xl shadow-xl border border-gray-200 min-w-[180px] flex flex-col gap-2 mt-2 p-2 z-50 bg-white"
        >
          @for (option of this.options(); track option) {
            <ui-button
              cdkMenuItem
              size="sm"
              contentAlignment="left"
              [label]="option.label"
              [variant]="option.variant ?? 'plain'"
              [trailingIcon]="option.trailingIcon"
              [prefixIcon]="option.prefixIcon"
              (cdkMenuItemTriggered)="this.optionClick.emit(option)"
            ></ui-button>
          }
        </div>
      </ng-template>
    </div>
  `,
  styles: `
  :host {
    display: flex;
  }
  `,
  standalone: true,
  imports: [
    CdkMenu,
    CdkMenuItem,
    CdkMenuTrigger,
    ButtonComponent,
    A11yModule,
    FocusableDirective,
    CdkTargetMenuAim,
  ],
})
export class DropdownMenuComponent {
  public options = input.required<DropdownMenuOption[]>();

  @Output()
  public optionClick: EventEmitter<DropdownMenuOption> = new EventEmitter();

  @Output()
  public dropdownOpen = new EventEmitter<void>();

  @Output()
  public dropdownClose = new EventEmitter<void>();
}

export interface DropdownMenuOption {
  label: string;
  trailingIcon?: IconName;
  prefixIcon?: IconName;
  variant?: ButtonVariant;
}
