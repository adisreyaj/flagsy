import { animate, style, transition, trigger } from '@angular/animations';
import { booleanAttribute, Component, input } from '@angular/core';

@Component({
  selector: 'ui-form-field',
  template: `
    <div>
      @if (this.label()) {
        <div class="mb-1 font-semibold text-sm text-gray-600">
          {{ this.label() }}
        </div>
      }
      <ng-content></ng-content>
      <footer class="h-4 mt-1">
        @if (this.showError() && this.errorMessage()) {
          <div class="flex items-center gap-1 text-red-500" @fadeSlideInOut>
            <svg
              class="h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"
              ></path>
            </svg>
            <div class="text-xs">{{ this.errorMessage() }}</div>
          </div>
        }

        @if (!this.showError() && this.hint()) {
          <div class="flex items-center gap-1 text-slate-400" @fadeSlideInOut>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z"
              ></path>
            </svg>
            <div class="text-xs">{{ this.hint() }}</div>
          </div>
        }
      </footer>
    </div>
  `,
  standalone: true,
  animations: [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-5px)' }),
        animate('300ms', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('200ms', style({ opacity: 0, transform: 'translateY(-5px)' })),
      ]),
    ]),
  ],
})
export class FormFieldComponent {
  public label = input<ValueOrUndefined<string>, string>(undefined, {
    transform: trimString,
  });
  public errorMessage = input<ValueOrUndefined<string>, string>(undefined, {
    transform: trimString,
  });
  public hint = input<ValueOrUndefined<string>, string>(undefined, {
    transform: trimString,
  });
  public showError = input<ValueOrUndefined<boolean>, boolean>(false, {
    transform: booleanAttribute,
  });
}

function trimString(value: string | undefined): string | undefined {
  return value?.trim() ?? undefined;
}

type ValueOrUndefined<T> = T | undefined;
