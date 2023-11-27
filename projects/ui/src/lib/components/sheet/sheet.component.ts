import { A11yModule } from '@angular/cdk/a11y';
import { NgComponentOutlet } from '@angular/common';
import { Component, inject, InjectionToken, Type } from '@angular/core';
import { trim } from 'lodash-es';
import { ButtonComponent } from '../button/button.component';
import { SheetRef } from './sheet-ref';

@Component({
  selector: 'ui-sheet',
  template: ` <div
    [cdkTrapFocusAutoCapture]="true"
    class="flex flex-col h-full"
    [cdkTrapFocus]="true"
  >
    <header class="flex flex-none items-center justify-between px-6 py-4">
      <div class="font-bold text-xl text-gray-800">
        {{ this.title }}
      </div>
      @if (this.showCloseButton) {
        <button
          class="w-6 h-6 rounded-md text-gray-700 hover:bg-gray-200 focus:ring-2 focus:ring-primary-500"
          (click)="this.close()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"
            ></path>
          </svg>
        </button>
      }
    </header>
    <section
      class="w-full flex-auto min-h-0 overflow-y-auto h-full"
      cdkFocusRegionEnd
    >
      <ng-container *ngComponentOutlet="this.content"></ng-container>
    </section>
  </div>`,
  styles: `
  :host {
    @apply w-full;
  }`,
  standalone: true,
  imports: [NgComponentOutlet, ButtonComponent, A11yModule],
})
export class SheetComponent<T> {
  readonly #sheetConfig = inject(SHEET_COMPONENT_ARGS);
  readonly #sheetRef: SheetRef = inject(SheetRef);

  get content(): Type<T> {
    return this.#sheetConfig.content as Type<T>;
  }

  get title(): string | undefined {
    return trim(this.#sheetConfig.title) ?? undefined;
  }

  get showCloseButton(): boolean {
    return this.#sheetConfig.showCloseButton ?? true;
  }

  close() {
    this.#sheetRef.close();
  }
}

export const SHEET_COMPONENT_ARGS = new InjectionToken<
  SheetComponentArgs<unknown, unknown>
>('Sheet Component Args');

export interface SheetComponentArgs<C, D> {
  content: Type<C>;
  title?: string;
  showCloseButton?: boolean;
  data?: D;
}
