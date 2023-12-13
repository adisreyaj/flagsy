import { A11yModule } from '@angular/cdk/a11y';
import {
  CdkMenu,
  CdkMenuItem,
  CdkMenuItemRadio,
  CdkMenuTrigger,
} from '@angular/cdk/menu';
import {
  AfterContentInit,
  booleanAttribute,
  Component,
  ContentChildren,
  Input,
  QueryList,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { IconName } from 'angular-remix-icon/lib/icon-names';
import { SelectOptionComponent } from './select-option.component';

@Component({
  selector: 'ui-select',
  template: `
    <button
      class="py-2 px-4 pr-2 flex gap-4 justify-between items-center w-full border border-gray-200 rounded-xl focus:ring-1 focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none transition-all duration-300"
      [cdkMenuTriggerFor]="menu"
      [disabled]="this.isDisabled()"
      (cdkMenuOpened)="this.isOpen.set(true)"
      (cdkMenuClosed)="this.isOpen.set(false)"
    >
      <div class="flex items-center gap-2">
        @if (this.prefixIcon) {
          <div>
            <rmx-icon class="!w-5 !h-5" [name]="this.prefixIcon"></rmx-icon>
          </div>
        }
        <div>{{ this.selectedItemLabel() ?? this.placeholder }}</div>
      </div>
      <div>
        <rmx-icon
          class="!w-5 !h-5 transform-gpu duration-300"
          [class.rotate-180]="this.isOpen()"
          name="arrow-down-s-line"
        ></rmx-icon>
      </div>
    </button>
    <ng-template #menu>
      @if (this.options && this.options.length > 0) {
        <ul
          class="border shadow-sm w-full min-w-[200px]"
          cdkMenu
          [cdkTrapFocus]="true"
        >
          @for (
            item of options?.toArray();
            track item.value;
            let index = $index
          ) {
            <button
              class="flex items-center gap-2 justify-between cursor-pointer px-4 pr-2 py-2 hover:bg-gray-100 rounded-md focus:ring-2 focus:ring-primary-500"
              cdkMenuItemRadio
              [class.bg-gray-100]="this.selectedItemValue() === item.value"
              [cdkMenuItemChecked]="this.selectedItemValue() === item.value"
              (cdkMenuItemTriggered)="this.selectItem(item)"
              [cdkMenuItemDisabled]="item.disabled"
            >
              <div>
                {{ item.label }}
              </div>
              @if (this.selectedItemValue() === item.value) {
                <div>
                  <rmx-icon
                    class="!w-5 !h-5 text-primary-500"
                    name="check-line"
                  ></rmx-icon>
                </div>
              }
            </button>
          }
        </ul>
      }
    </ng-template>
  `,
  standalone: true,
  imports: [
    CdkMenu,
    CdkMenuItem,
    CdkMenuTrigger,
    A11yModule,
    CdkMenuItemRadio,
    AngularRemixIconComponent,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectComponent,
      multi: true,
    },
  ],
})
export class SelectComponent<Value = unknown>
  implements ControlValueAccessor, AfterContentInit
{
  @ContentChildren(SelectOptionComponent)
  protected options?: QueryList<SelectOptionComponent<Value>>;

  @Input({ transform: booleanAttribute })
  public set disabled(isDisabled: boolean) {
    this.isDisabled.set(isDisabled);
  }

  @Input()
  public placeholder: string = 'Select';

  @Input()
  public prefixIcon?: IconName;

  protected isDisabled = signal(false);
  protected isOpen = signal(false);
  protected selectedItemValue = signal<Value | undefined>(undefined);
  protected selectedItemLabel = signal<string | undefined>(undefined);

  private propagateChange?: (value: Value) => void;
  private propagateTouch?: () => void;

  public ngAfterContentInit(): void {
    if (this.selectedItemValue() === undefined) {
      this.selectedItemValue.set(this.options?.first?.value);
      this.selectedItemLabel.set(this.options?.first?.label);
    } else {
      if (this.selectedItemLabel() === undefined) {
        this.selectedItemLabel.set(
          this.options?.find((o) => o.value === this.selectedItemValue())
            ?.label,
        );
      }
    }
  }

  writeValue(value: Value): void {
    this.selectedItemValue.set(value);
    if (this.options) {
      this.selectedItemLabel.set(
        this.options.find((o) => o.value === value)?.label,
      );
    }
  }

  registerOnChange(fn: (value: Value) => void): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.propagateTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  public selectItem(option: SelectOptionComponent<Value>): void {
    this.selectedItemValue.set(option.value);
    this.selectedItemLabel.set(option.label);
    this.propagateChange?.(option.value);
    this.propagateTouch?.();
  }
}
