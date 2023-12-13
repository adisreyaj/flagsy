import { booleanAttribute, Component, Input, signal } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'ui-checkbox',
  template: ` <div class="text-sm font-normal">
    <label [for]="this.label" class="flex items-center gap-2 cursor-pointer">
      <input
        [id]="this.label"
        type="checkbox"
        class="h-5 w-5 cursor-pointer"
        [ngModel]="this.value()"
        (ngModelChange)="this.updateValue($event)"
      />
      <div>
        {{ this.label }}
      </div>
    </label>
  </div>`,
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CheckboxComponent,
      multi: true,
    },
  ],
  imports: [ReactiveFormsModule, FormsModule],
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input()
  label: string = '';

  @Input({ transform: booleanAttribute })
  public set disabled(isDisabled: boolean) {
    this.isDisabled.set(isDisabled);
  }

  protected readonly value = signal(false);
  protected readonly isDisabled = signal(false);

  private propagateValueChange?: (checked: boolean) => void;
  private propagateTouch?: () => void;

  writeValue(value?: boolean): void {
    this.value.set(value ?? false);
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

  updateValue(value: boolean): void {
    this.value.set(value);
    this.propagateValueChange?.(value);
    this.propagateTouch?.();
  }
}
