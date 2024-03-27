import { A11yModule } from '@angular/cdk/a11y';
import {
  CdkMenu,
  CdkMenuItem,
  CdkMenuItemRadio,
  CdkMenuTrigger,
} from '@angular/cdk/menu';
import {
  AfterContentInit,
  Component,
  contentChildren,
  input,
  model,
  output,
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
      class="py-2 px-4 pr-2 flex gap-4 text-sm justify-between items-center w-full border border-gray-200 rounded-xl focus:ring-1 focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none transition-all duration-300"
      [cdkMenuTriggerFor]="menu"
      [disabled]="this.disabled()"
      (cdkMenuOpened)="this.isOpen.set(true)"
      (cdkMenuClosed)="this.isOpen.set(false)"
    >
      <div class="flex items-center gap-2">
        @if (this.prefixIcon()) {
          <div>
            <rmx-icon class="!w-5 !h-5" [name]="this.prefixIcon()!"></rmx-icon>
          </div>
        }
        <div>{{ this.selectedItemLabel() ?? this.placeholder() }}</div>
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
      @if (this.options().length > 0) {
        <ul
          class="border shadow-sm bg-white z-10 w-full min-w-[200px] p-2 flex flex-col gap-2  border-gray-200 rounded-xl"
          cdkMenu
          [cdkTrapFocus]="true"
        >
          @for (item of this.options(); track item.value; let index = $index) {
            <button
              class="flex w-full items-center gap-2 justify-between cursor-pointer  px-4 pr-2 py-2 hover:bg-gray-100 rounded-md focus:ring-2 focus:ring-primary-500"
              cdkMenuItemRadio
              [class.bg-gray-100]="this.selectedItemValue() === item.value()"
              [cdkMenuItemChecked]="this.selectedItemValue() === item.value()"
              (cdkMenuItemTriggered)="this.selectItem(item)"
              [cdkMenuItemDisabled]="item.disabled()"
              (click)="this.selectionChange.emit(item.value())"
            >
              <div>
                {{ item.label() }}
              </div>
              @if (this.selectedItemValue() === item.value()) {
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class SelectComponent<Value = any>
  implements ControlValueAccessor, AfterContentInit
{
  public placeholder = input<string>('Select');
  public prefixIcon = input<IconName | undefined>();

  protected disabled = model(false);
  protected isOpen = model(false);

  public readonly selectionChange = output<Value>();

  protected options = contentChildren<SelectOptionComponent<Value>>(
    SelectOptionComponent,
  );

  protected selectedItemValue = signal<Value | undefined>(undefined);
  protected selectedItemLabel = signal<string | undefined>(undefined);

  #propagateChange?: (value: Value) => void;
  #propagateTouch?: () => void;

  public ngAfterContentInit(): void {
    if (this.selectedItemValue() === undefined) {
      this.selectedItemValue.set(this.options()?.[0]?.value());
      this.selectedItemLabel.set(this.options()?.[0]?.label());
    } else {
      if (this.selectedItemLabel() === undefined) {
        this.selectedItemLabel.set(
          this.options()
            ?.find((o) => o.value() === this.selectedItemValue())
            ?.label(),
        );
      }
    }
  }

  public writeValue(value: Value): void {
    this.selectedItemValue.set(value);
    if (this.options) {
      this.selectedItemLabel.set(
        this.options()
          .find((o) => o.value() === value)
          ?.label(),
      );
    }
  }

  public registerOnChange(fn: (value: Value) => void): void {
    this.#propagateChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.#propagateTouch = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected selectItem(option: SelectOptionComponent<Value>): void {
    this.selectedItemValue.set(option.value());
    this.selectedItemLabel.set(option.label());
    this.#propagateChange?.(option.value());
    this.#propagateTouch?.();
  }
}
