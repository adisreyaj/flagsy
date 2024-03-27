import {
  Component,
  ElementRef,
  HostBinding,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'ui-checkbox',
  template: ` <div class="text-sm font-normal">
    <label [for]="this.label()" class="flex items-center gap-2 cursor-pointer">
      <input
        #input
        type="checkbox"
        class="h-5 w-5 cursor-pointer"
        [id]="this.label()"
        [disabled]="this.disabled()"
        [ngModel]="this.checked()"
        (ngModelChange)="this.updateValue($event)"
      />
      <div>
        {{ this.label() }}
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
  public label = input<string>('');
  public checked = model<boolean>(false);
  public disabled = model<boolean>(false);

  public readonly checkedChange = output<boolean>();

  #inputTpl = viewChild('input', { read: ElementRef });

  @HostBinding('focus')
  public focusCheckBox = () => {
    this.#inputTpl()?.nativeElement.focus();
  };

  #propagateValueChange?: (checked: boolean) => void;
  #propagateTouch?: () => void;

  public writeValue(value?: boolean): void {
    this.checked.set(value ?? false);
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

  protected updateValue(value: boolean): void {
    this.checked.set(value);
    this.checkedChange.emit(value);
    this.#propagateValueChange?.(value);
    this.#propagateTouch?.();
  }
}
