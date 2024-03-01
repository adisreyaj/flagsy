import { A11yModule } from '@angular/cdk/a11y';
import {
  CdkMenu,
  CdkMenuItem,
  CdkMenuTrigger,
  CdkTargetMenuAim,
} from '@angular/cdk/menu';
import {
  Component,
  EventEmitter,
  input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FocusableDirective } from '@ui/a11y';
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
          cdkMenu
          class="rounded-xl shadow-xl border border-gray-200 min-w-[150px]"
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
export class DropdownComponent {
  public options = input.required<DropdownOption[]>();

  @Output()
  public optionClick: EventEmitter<DropdownOption> = new EventEmitter();

  @Output()
  public dropdownOpen = new EventEmitter<void>();

  @Output()
  public dropdownClose = new EventEmitter<void>();

  @ViewChildren(FocusableDirective)
  protected focusableItems!: QueryList<FocusableDirective>;
  protected readonly console = console;
}

export interface DropdownOption {
  label: string;
  trailingIcon?: IconName;
  prefixIcon?: IconName;
  variant?: ButtonVariant;
}
