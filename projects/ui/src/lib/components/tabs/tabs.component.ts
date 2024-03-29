import { FocusKeyManager } from '@angular/cdk/a11y';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  model,
  output,
  Signal,
  signal,
  viewChildren,
} from '@angular/core';
import { FocusableDirective } from '@ui/a11y';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { TabComponent } from './tab.component';

@Component({
  selector: 'ui-tabs',
  template: ` <div class="tabs">
    <div
      role="tablist"
      class="-mb-px flex items-center text-base text-gray-500 border-b border-b-gray-200"
      (keydown)="this.onKeydown($event)"
    >
      @for (tab of this.tabs(); track tab; let i = $index) {
        <button
          role="tab"
          class="flex item flex-1 cursor-pointer relative transition-colors duration-300"
          focusable
          [disabled]="tab.disabled()"
          [tabindex]="this.tabIndex() === i ? 0 : -1"
          [attr.aria-selected]="this.tabIndex() === i"
          [class.active]="this.tabIndex() === i"
          [class.disabled]="tab.disabled()"
          (click)="!tab.disabled() && this.selectTab(i)"
          (keydown.enter)="!tab.disabled() && this.selectTab(i)"
          (keydown.space)="!tab.disabled() && this.selectTab(i)"
          (focus)="this.setFocusedAsActiveInKeyManager(i)"
        >
          <div
            class="relative flex items-center justify-center gap-2 px-1 py-3 w-full"
          >
            @if (tab.icon(); as iconName) {
              <div>
                <rmx-icon [name]="iconName" class="!w-5 !h-5"></rmx-icon>
              </div>
            }
            <div>
              {{ tab.title() }}
            </div>
          </div>
        </button>
      }
    </div>
    <div>
      @if (this.selectedTab()?.content(); as content) {
        <ng-container *ngTemplateOutlet="content"></ng-container>
      }
    </div>
  </div>`,
  styles: [
    // language=scss
    `
      .item {
        &:not(.disabled) {
          @apply hover:text-gray-600;
          @apply focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 focus-visible:outline-none;
        }

        &.disabled {
          @apply cursor-not-allowed;
          @apply opacity-50;
        }

        &:hover,
        &.active {
          @apply after:absolute after:left-0 after:bottom-[-1px] after:h-0.5 after:w-full;
        }
        &:hover {
          @apply after:bg-gray-300;
        }
        &.active {
          @apply text-primary-500 after:bg-primary-500;
        }
      }
    `,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, AngularRemixIconComponent, FocusableDirective],
})
export class TabsComponent {
  public readonly tabIndex = model<number>(0);

  public readonly tabChange = output<TabChangeEvent>();

  protected readonly tabs = contentChildren(TabComponent);
  protected readonly tabListItemsSignal = viewChildren(FocusableDirective);

  readonly #keyManager: Signal<FocusKeyManager<unknown> | undefined> = signal<
    FocusKeyManager<unknown> | undefined
  >(undefined);

  protected readonly selectedTab: Signal<TabComponent | undefined> = computed(
    () => {
      const tabs = this.tabs();
      const selectedTabIndex = this.tabIndex();
      return tabs?.[selectedTabIndex];
    },
  );

  public constructor() {
    this.#keyManager = computed(() => {
      return new FocusKeyManager(
        this.tabListItemsSignal() as FocusableDirective[],
      )
        .withWrap(true)
        .withHorizontalOrientation('ltr');
    });
  }

  public selectTab(i: number): void {
    const prevIndex = this.tabIndex();
    this.tabIndex.set(i);
    this.tabChange.emit({ prevIndex, currIndex: i });
  }

  protected onKeydown(event: KeyboardEvent) {
    this.#keyManager()?.onKeydown(event);
  }

  public setFocusedAsActiveInKeyManager(i: number): void {
    this.#keyManager()?.updateActiveItem(i);
  }
}

export interface TabChangeEvent {
  prevIndex: number;
  currIndex: number;
}
