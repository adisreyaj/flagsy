import { A11yModule } from '@angular/cdk/a11y';
import { NgComponentOutlet } from '@angular/common';
import { Component, inject, Type } from '@angular/core';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { IconName } from 'angular-remix-icon/lib/icon-names';
import { trim } from 'lodash-es';
import { ModalRef } from './modal.ref';
import {
  DIALOG_COMPONENT,
  DIALOG_CONFIG,
  ModalConfig,
  ModalDataType,
} from './modal.type';

@Component({
  selector: 'ui-modal',
  template: `
    <div
      [cdkTrapFocusAutoCapture]="true"
      class="flex flex-col h-full text-gray-600"
      [cdkTrapFocus]="true"
    >
      <header class="flex flex-none items-center justify-center p-4 pt-8">
        <div class="flex flex-col items-center gap-2">
          @if (this.modalIcon; as modalIcon) {
            <rmx-icon
              [class]="[this.modalIconColor, '!w-12', '!h-12']"
              [name]="modalIcon"
            ></rmx-icon>
          }
          <div class="font-semibold text-lg text-gray-600">
            {{ this.title }}
          </div>
        </div>
        <button
          class="hidden w-6 h-6 rounded-md text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-primary-500"
          (click)="this.close()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"
            ></path>
          </svg>
        </button>
      </header>
      <section
        class="w-full flex-auto min-h-0 overflow-y-auto h-full"
        cdkFocusRegionEnd
      >
        <ng-container *ngComponentOutlet="this.content"></ng-container>
      </section>
    </div>
  `,
  standalone: true,
  imports: [NgComponentOutlet, A11yModule, AngularRemixIconComponent],
})
export class ModalComponent {
  protected readonly content: Type<unknown> = inject(DIALOG_COMPONENT);
  readonly #modalConfig = inject<ModalConfig>(DIALOG_CONFIG);
  readonly #modalRef = inject(ModalRef);

  get title(): string | undefined {
    return trim(this.#modalConfig?.title) ?? undefined;
  }

  get modalIcon(): IconName | undefined {
    switch (this.#modalConfig?.dataType) {
      case ModalDataType.Info:
        return 'information-fill';

      case ModalDataType.Warning:
        return 'error-warning-fill';

      default:
        return undefined;
    }
  }

  get modalIconColor(): string | undefined {
    switch (this.#modalConfig?.dataType) {
      case ModalDataType.Info:
        return 'text-blue-600';

      case ModalDataType.Warning:
        return 'text-amber-500';

      default:
        return undefined;
    }
  }

  public close(): void {
    this.#modalRef.close();
  }
}
