import { FocusKeyManager } from '@angular/cdk/a11y';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  EventEmitter,
  Input,
  Output,
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
          [disabled]="tab.disabled"
          [tabindex]="this.selectedTabIndex() === i ? 0 : -1"
          [attr.aria-selected]="this.selectedTabIndex() === i"
          [class.active]="this.selectedTabIndex() === i"
          [class.disabled]="tab.disabled"
          (click)="!tab.disabled && this.selectTab(i)"
          (keydown.enter)="!tab.disabled && this.selectTab(i)"
          (keydown.space)="!tab.disabled && this.selectTab(i)"
          (focus)="this.setFocusedAsActiveInKeyManager(i)"
        >
          <div
            class="relative flex items-center justify-center gap-2 px-1 py-3 w-full"
          >
            @if (tab.icon) {
              <div>
                <rmx-icon [name]="tab.icon" class="!w-5 !h-5"></rmx-icon>
              </div>
            }
            <div>
              {{ tab.title }}
            </div>
          </div>
        </button>
      }
    </div>
    <div>
      @if (this.selectedTab()?.content) {
        <ng-container
          *ngTemplateOutlet="this.selectedTab()!.content"
        ></ng-container>
      }
    </div>
  </div>`,
  styles: [
    // language=scss
    `
      .item {
        &:not(.disabled) {
          @apply hover:text-gray-600;
          @apply focus:ring-inset focus:ring-2 focus:ring-inset focus:ring-primary-500 focus:outline-none;
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
  readonly tabsChildrenSignal = contentChildren(TabComponent);
  readonly tabListItemsSignal = viewChildren(FocusableDirective);

  readonly keyManager: Signal<FocusKeyManager<unknown> | undefined> = signal<
    FocusKeyManager<unknown> | undefined
  >(undefined);

  @Input()
  set tabIndex(selectedTabIndex: number) {
    console.log('selectedTabIndex', selectedTabIndex);
    this.selectedTabIndex.set(selectedTabIndex);
  }

  @Output()
  readonly tabChange: EventEmitter<TabChangeEvent> =
    new EventEmitter<TabChangeEvent>();

  readonly selectedTabIndex = signal<number>(0);

  readonly tabs: Signal<ReadonlyArray<TabComponent>> = signal<
    ReadonlyArray<TabComponent>
  >([]);

  readonly selectedTab = computed(() => {
    const tabs = this.tabs();
    const selectedTabIndex = this.selectedTabIndex();
    return tabs[selectedTabIndex];
  });

  public constructor() {
    this.tabs = computed(() => this.tabsChildrenSignal());
    this.keyManager = computed(() => {
      return new FocusKeyManager(
        this.tabListItemsSignal() as FocusableDirective[],
      )
        .withWrap(true)
        .withHorizontalOrientation('ltr');
    });
  }

  public selectTab(i: number): void {
    const prevIndex = this.selectedTabIndex();
    this.selectedTabIndex.set(i);
    this.tabChange.emit({ prevIndex, currIndex: i });
  }

  onKeydown(event: KeyboardEvent) {
    this.keyManager()?.onKeydown(event);
  }

  public setFocusedAsActiveInKeyManager(i: number): void {
    this.keyManager()?.updateActiveItem(i);
  }
}

export interface TabChangeEvent {
  prevIndex: number;
  currIndex: number;
}
