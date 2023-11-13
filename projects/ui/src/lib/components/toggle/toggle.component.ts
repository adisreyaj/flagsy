import { booleanAttribute, Component, Input, signal } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'ui-toggle',
  template: `
    <label
      for="AcceptConditions"
      [class.disabled]="this.isDisabled()"
      class="relative block h-5 w-10 cursor-pointer [-webkit-tap-highlight-color:_transparent]"
    >
      <input
        type="checkbox"
        id="AcceptConditions"
        class="peer sr-only"
        [disabled]="this.isDisabled()"
        [ngModel]="this.isChecked()"
        (ngModelChange)="updateChecked($event)"
      />

      <span
        class="absolute inset-0 rounded-full bg-gray-300 transition peer-checked:bg-primary-600 peer-disabled:bg-gray-200"
      >
      </span>

      <span
        class="absolute inset-y-0 start-0 m-1 h-3 w-3 rounded-full bg-white transition-all peer-checked:start-5"
      >
      </span>
    </label>
  `,
  styles: [
    `
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
  @Input({ transform: booleanAttribute })
  public set disabled(isDisabled: boolean) {
    this.isDisabled.set(isDisabled);
  }

  protected isDisabled = signal(false);
  protected readonly isChecked = signal(false);

  private propagateValueChange?: (value: boolean) => void;
  private propagateTouch?: () => void;

  writeValue(isEnabled: boolean): void {
    this.isChecked.set(isEnabled);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.propagateValueChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.propagateTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  public updateChecked(isChecked: boolean): void {
    this.isChecked.set(isChecked);
    this.propagateValueChange?.(isChecked);
    this.propagateTouch?.();
  }
}
