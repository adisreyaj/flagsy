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
  effect,
  Input,
  QueryList,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectOptionComponent } from './select-option.component';

@Component({
  selector: 'ui-select',
  template: `
    <button
      class="py-2 px-4 pr-2 flex justify-between items-center w-full border border-gray-200 rounded-lg focus:ring-1 focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"
      [cdkMenuTriggerFor]="menu"
      [disabled]="this.isDisabled()"
      (cdkMenuOpened)="this.isOpen.set(true)"
      (cdkMenuClosed)="this.isOpen.set(false)"
    >
      <div>{{ this.selectedItemLabel() }}</div>
      <div>
        <svg
          class="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M11.9997 13.1714L16.9495 8.22168L18.3637 9.63589L11.9997 15.9999L5.63574 9.63589L7.04996 8.22168L11.9997 13.1714Z"
          ></path>
        </svg>
      </div>
    </button>
    <ng-template #menu>
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
                <svg
                  class="w-5 h-5 text-primary-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M10.0007 15.1709L19.1931 5.97852L20.6073 7.39273L10.0007 17.9993L3.63672 11.6354L5.05093 10.2212L10.0007 15.1709Z"
                  ></path>
                </svg>
              </div>
            }
          </button>
        }
      </ul>
    </ng-template>
  `,
  standalone: true,
  imports: [CdkMenu, CdkMenuItem, CdkMenuTrigger, A11yModule, CdkMenuItemRadio],
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

  protected isDisabled = signal(false);
  protected isOpen = signal(false);
  protected selectedItemValue = signal<Value | undefined>(undefined);
  protected selectedItemLabel = signal<string | undefined>(undefined);

  private propagateChange?: (value: Value) => void;
  private propagateTouch?: () => void;

  constructor() {
    effect(() => {
      console.log(this.isOpen());
    });
  }

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
