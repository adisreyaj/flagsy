import {
  booleanAttribute,
  Component,
  inject,
  Input,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { IconName } from 'angular-remix-icon/lib/icon-names';
import { debounce } from 'lodash-es';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
  selector: 'ui-input',
  template: `
    <div
      class="flex gap-2 items-center relative group h-[42px]"
      [class.disabled]="this.isDisabled()"
    >
      @if (this.prefixIcon; as prefixIcon) {
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
        [class.pl-10]="this.prefixIcon"
        [class.form-field-input]="this.isWithinFormField"
        [class.error]="this.hasError"
        [type]="this.type"
        [disabled]="this.isDisabled()"
        [placeholder]="this.placeholder"
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
  @Input()
  public type: string = 'text';

  @Input()
  public placeholder: string = '';

  @Input()
  public prefixIcon?: IconName;

  @Input()
  public debounceTime: number = 0;

  @Input({ transform: booleanAttribute })
  public set disabled(isDisabled: boolean) {
    this.isDisabled.set(isDisabled);
  }

  protected readonly value = signal('');
  protected readonly isDisabled = signal(false);

  protected readonly formField? = inject(FormFieldComponent, {
    optional: true,
  });

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
    this.debouncedNotifyChange(value)();
  }

  private debouncedNotifyChange(value: string) {
    return debounce(() => {
      this.propagateValueChange?.(value);
      this.propagateTouch?.();
    }, this.debounceTime);
  }
}
