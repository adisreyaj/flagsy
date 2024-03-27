import { Component, inject, input, model, output } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { IconName } from 'angular-remix-icon/lib/icon-names';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
  selector: 'ui-input',
  template: `
    <div
      class="flex gap-2 items-center relative group h-[42px]"
      [class.disabled]="this.disabled()"
    >
      @if (this.prefixIcon(); as prefixIcon) {
        <div class="absolute h-full top-0 left-3 flex items-center z-10">
          <rmx-icon
            class="icon text-gray-500"
            [class.error]="this.hasError"
            [name]="prefixIcon"
          ></rmx-icon>
        </div>
      }
      <input
        class="absolute w-full py-2 px-4 block border border-gray-200 focus-visible-outline rounded-xl disabled:opacity-50 disabled:pointer-events-none transition-all duration-300"
        [class.pl-10]="this.prefixIcon() !== undefined"
        [class.form-field-input]="this.isWithinFormField"
        [class.error]="this.hasError"
        [type]="this.type()"
        [disabled]="this.disabled()"
        [placeholder]="this.placeholder()"
        [ngModel]="this.value()"
        (ngModelChange)="this.updateValue($event)"
        [spellcheck]="false"
      />
    </div>
  `,
  styles: [
    //language=scss
    `
      .disabled {
        @apply cursor-not-allowed opacity-70;
      }
      @mixin errorBorder() {
        @apply border-red-500 ring-red-500;
      }

      :host {
        &.ng-dirty.ng-invalid {
          input {
            @include errorBorder;
          }
        }
      }

      .icon {
        @apply w-5 h-5;
        &:not(.error) {
          @apply group-focus-within:text-primary-600;
        }

        &.error {
          @apply text-red-500;
        }
      }

      .error {
        @include errorBorder;
      }
    `,
  ],
  standalone: true,
  imports: [FormsModule, AngularRemixIconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputComponent,
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  public type = input<string>('text');
  public placeholder = input<string>('');
  public prefixIcon = input<IconName | undefined>(undefined);

  public value = model<string>('');
  public disabled = model<boolean>(false);

  public inputChange = output<string>();

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
    this.#notifyChange(value);
  }

  #notifyChange(value: string) {
    this.#propagateValueChange?.(value);
    this.#propagateTouch?.();
    this.inputChange.emit(value);
  }
}
