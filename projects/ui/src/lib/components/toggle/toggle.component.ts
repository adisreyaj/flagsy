import { Component, model } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'ui-toggle',
  template: `
    <label
      [class.disabled]="this.disabled()"
      class="toggle rounded-full relative block h-6 w-11 cursor-pointer [-webkit-tap-highlight-color:_transparent]"
    >
      <input
        type="checkbox"
        class="peer sr-only"
        [disabled]="this.disabled()"
        [ngModel]="this.checked()"
        (ngModelChange)="updateChecked($event)"
      />

      <span
        class="absolute inset-0 rounded-full bg-gray-300 transition peer-checked:bg-primary-600 peer-disabled:opacity-70 ring-offset-2 peer-focus:ring-2 peer-focus:ring-primary-500"
      >
      </span>

      <span
        class="absolute inset-y-0 start-0 m-1 h-4 w-4 rounded-full bg-white transition-all peer-checked:start-5"
      >
      </span>
    </label>
  `,
  styles: [
    `
      :host {
        display: flex;
        width: fit-content;
        height: 42px;
        align-items: center;
      }
      .disabled {
        cursor: not-allowed;
      }
    `,
  ],
  standalone: true,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ToggleComponent,
      multi: true,
    },
  ],
})
export class ToggleComponent implements ControlValueAccessor {
  public disabled = model(false);
  public checked = model(false);

  #propagateValueChange?: (value: boolean) => void;
  #propagateTouch?: () => void;

  public writeValue(isEnabled: boolean): void {
    this.checked.set(isEnabled);
  }

  public registerOnChange(fn: (value: boolean) => void): void {
    this.#propagateValueChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.#propagateTouch = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected updateChecked(isChecked: boolean): void {
    this.checked.set(isChecked);
    this.#propagateValueChange?.(isChecked);
    this.#propagateTouch?.();
  }
}
