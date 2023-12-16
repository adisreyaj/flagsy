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
} from '@angular/core';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { merge, of } from 'rxjs';
import { TabComponent } from './tab.component';

@Component({
  selector: 'ui-tabs',
  template: ` <div class="">
    <ul
      class="-mb-px flex items-center text-base text-gray-600 border-b border-b-gray-200"
    >
      @for (tab of this.tabs(); track tab; let i = $index) {
        <li
          class="flex item flex-1 cursor-pointer relative transition-colors duration-300"
          [tabIndex]="tab.disabled ? -1 : 0"
          [class.active]="this.selectedTabIndex() === i"
          [class.disabled]="tab.disabled"
          (click)="this.selectTab(i)"
          (keydown.enter)="this.selectTab(i)"
          (keydown.space)="this.selectTab(i)"
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
  styles: `
  .item {
    &:not(.disabled) {
      @apply hover:bg-gray-100 hover:text-primary-500;
      @apply focus:ring-inset focus:ring-2 focus:ring-inset focus:ring-primary-500 focus:outline-none;
    }
    
    &.disabled {
      @apply cursor-not-allowed;
      @apply opacity-50;
    }
  }
  
  .active {
     @apply text-primary-500 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-primary-500;
    }
  `,
  standalone: true,
  imports: [NgTemplateOutlet, AngularRemixIconComponent],
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent)
  tabsChildren?: QueryList<TabComponent>;

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
      merge(of(this.tabsChildren), this.tabsChildren?.changes).subscribe(
        (tabs) => {
          this.tabs.set(tabs.toArray());
        },
      );
    }
  }

  public selectTab(i: number): void {
    const prevIndex = this.selectedTabIndex();
    this.selectedTabIndex.set(i);
    this.tabChange.emit({ prevIndex, currIndex: i });
  }
}

export interface TabChangeEvent {
  prevIndex: number;
  currIndex: number;
}
