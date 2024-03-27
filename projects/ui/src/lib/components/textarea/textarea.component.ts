import {
  Component,
  inject,
  input,
  model,
  numberAttribute,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
  selector: 'ui-textarea',
  template: ` <textarea
    class="py-2 px-4 block w-full border border-gray-200 rounded-xl resize-none focus:ring-1 focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none transition-all duration-300"
    [rows]="this.rows"
    [disabled]="this.disabled()"
    [placeholder]="this.placeholder()"
    [ngModel]="this.value()"
    (ngModelChange)="this.updateValue($event)"
    [spellcheck]="true"
  >
  </textarea>`,
  standalone: true,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TextareaComponent,
      multi: true,
    },
  ],
})
export class TextareaComponent implements ControlValueAccessor {
  public placeholder = input<string>('');

  public rows = input<number | string, number>(3, {
    transform: numberAttribute,
  });

  protected readonly value = model('');
  protected readonly disabled = model(false);

  readonly #formField? = inject(FormFieldComponent, {
    optional: true,
  });

  #propagateValueChange?: (value: string) => void;
  #propagateTouch?: () => void;

  protected get isWithinFormField(): boolean {
    return this.#formField !== undefined;
  }

  protected get hasError(): boolean {
    return this.#formField?.showError() ?? false;
  }

  public writeValue(value?: string): void {
    this.value.set(value ?? '');
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.#propagateValueChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.#propagateTouch = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected updateValue(value: string): void {
    this.value.set(value);
    this.#propagateValueChange?.(value);
    this.#propagateTouch?.();
  }
}
