import { booleanAttribute, Component, Input, signal } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'ui-input',
  template: ` <input
    class="py-2 px-3 block w-full border border-gray-200 rounded-lg focus:ring-1 focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none"
    [type]="this.type"
    [disabled]="this.isDisabled()"
    [placeholder]="this.placeholder"
    [ngModel]="this.value()"
    (ngModelChange)="this.updateValue($event)"
  />`,
  standalone: true,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputComponent,
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input()
  public type: string = 'text';

  @Input()
  public placeholder: string = '';

  @Input({ transform: booleanAttribute })
  public set disabled(isDisabled: boolean) {
    this.isDisabled.set(isDisabled);
  }

  protected readonly value = signal('');
  protected readonly isDisabled = signal(false);

  private propagateValueChange?: (value: string) => void;
  private propagateTouch?: () => void;

  writeValue(value?: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.propagateValueChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.propagateTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  public updateValue(value: string): void {
    this.value.set(value);
    this.propagateValueChange?.(value);
    this.propagateTouch?.();
  }
}
