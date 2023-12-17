import { FocusKeyManager } from '@angular/cdk/a11y';
import { NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  Component,
  computed,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { FocusableDirective } from '@ui/a11y';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { debounceTime, merge, of, switchMap, tap } from 'rxjs';
import { TabComponent } from './tab.component';

@Component({
  selector: 'ui-tabs',
  template: ` <div class="">
    <ul
      class="-mb-px flex items-center text-base text-gray-500 border-b border-b-gray-200"
      (keydown)="this.onKeydown($event)"
    >
      @for (tab of this.tabs(); track tab; let i = $index) {
        <li
          focusable
          [disabled]="tab.disabled"
          class="flex item flex-1 cursor-pointer relative transition-colors duration-300"
          [tabIndex]="tab.disabled || this.selectedTabIndex() === i ? -1 : 0"
          [class.active]="this.selectedTabIndex() === i"
          [class.disabled]="tab.disabled"
          (click)="!tab.disabled && this.selectTab(i)"
          (keydown.enter)="!tab.disabled && this.selectTab(i)"
          (keydown.space)="!tab.disabled && this.selectTab(i)"
          (focus)="this.keyManager?.setActiveItem(i)"
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
        </li>
      }
    </ul>
    <div>
      @if (this.selectedTab()?.content) {
        <ng-container
          *ngTemplateOutlet="this.selectedTab()!.content"
        ></ng-container>
      }
    </div>
  </div>`,
  styles: [
    `
      @mixin borderBottom() {
        @apply after:absolute after:left-0 after:bottom-[-1px] after:h-0.5 after:w-full;
      }

      .item {
        &:not(.disabled) {
          @apply hover:text-gray-600;
          @apply focus:ring-inset focus:ring-2 focus:ring-inset focus:ring-primary-500 focus:outline-none;
        }

        &.disabled {
          @apply cursor-not-allowed;
          @apply opacity-50;
        }
        &:hover {
          @include borderBottom();
          @apply after:bg-gray-300;
        }
        &.active {
          @include borderBottom();
          @apply text-primary-500 after:bg-primary-500;
        }
      }
    `,
  ],
  standalone: true,
  imports: [NgTemplateOutlet, AngularRemixIconComponent, FocusableDirective],
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent)
  tabsChildren?: QueryList<TabComponent>;

  @ViewChildren(FocusableDirective)
  tabsListItems!: QueryList<FocusableDirective>;

  keyManager?: FocusKeyManager<unknown>;

  @Input()
  set tabIndex(selectedTabIndex: number) {
    console.log('selectedTabIndex', selectedTabIndex);
    this.selectedTabIndex.set(selectedTabIndex);
  }

  @Output()
  readonly tabChange: EventEmitter<TabChangeEvent> =
    new EventEmitter<TabChangeEvent>();

  readonly selectedTabIndex = signal<number>(0);
  readonly tabs = signal<TabComponent[]>([]);
  readonly selectedTab = computed(() => {
    const tabs = this.tabs();
    const selectedTabIndex = this.selectedTabIndex();
    return tabs[selectedTabIndex];
  });

  public ngAfterContentInit(): void {
    if (this.tabsChildren) {
      merge(of(this.tabsChildren), this.tabsChildren?.changes)
        .pipe(
          tap((tabs) => {
            this.tabs.set(tabs.toArray());
          }),
          debounceTime(0),
          switchMap(() =>
            merge(of(this.tabsListItems), this.tabsListItems?.changes),
          ),
        )
        .subscribe((items) => {
          this.keyManager = new FocusKeyManager(items)
            .withWrap(true)
            .withHorizontalOrientation('ltr');
        });
    }
  }

  public selectTab(i: number): void {
    const prevIndex = this.selectedTabIndex();
    this.selectedTabIndex.set(i);
    this.tabChange.emit({ prevIndex, currIndex: i });
  }

  onKeydown(event: KeyboardEvent) {
    this.keyManager?.onKeydown(event);
  }
}

export interface TabChangeEvent {
  prevIndex: number;
  currIndex: number;
}
