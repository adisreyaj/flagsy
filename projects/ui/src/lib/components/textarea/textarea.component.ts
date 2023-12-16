import {
  booleanAttribute,
  Component,
  inject,
  Input,
  numberAttribute,
  signal,
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
    [disabled]="this.isDisabled()"
    [placeholder]="this.placeholder"
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
  @Input()
  public placeholder: string = '';

  @Input({ transform: numberAttribute })
  public rows: number = 3;

  @Input({ transform: booleanAttribute })
  public set disabled(isDisabled: boolean) {
    this.isDisabled.set(isDisabled);
  }

  protected readonly value = signal('');
  protected readonly isDisabled = signal(false);

  protected readonly formField? = inject(FormFieldComponent);

  private propagateValueChange?: (value: string) => void;
  private propagateTouch?: () => void;

  get isWithinFormField(): boolean {
    return this.formField !== undefined;
  }

  get hasError(): boolean {
    return this.formField?.showError ?? false;
  }

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
