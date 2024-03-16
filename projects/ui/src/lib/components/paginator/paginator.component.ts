import {
  Component,
  computed,
  EventEmitter,
  input,
  OnChanges,
  Output,
  signal,
  Signal,
} from '@angular/core';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { SelectOption } from '../../../../../../src/app/shared/components/select.type';
import { SimpleChangesTyped } from '../../types/common';
import { ButtonComponent } from '../button/button.component';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
import { SelectComponent, SelectOptionComponent } from '../select';

@Component({
  selector: 'ui-paginator',
  template: ` @if (this.totalCount() > this.activePageLimit()) {
    <div class="flex items-center justify-between">
      <div>
        <span class="text-sm text-gray-500">
          Showing
          <span class="font-medium">{{ this.startPos() }}</span>
          to
          <span class="font-medium">
            {{ this.endPos() }}
          </span>
          of
          <span class="font-medium">{{ this.totalCount() }}</span>
          results
        </span>
      </div>

      <div>
        <div class="flex items-center gap-2">
          <div class="flex gap-2 items-center text-sm">
            <p>Items per page:</p>
            <ui-select>
              @for (
                option of this.availablePageLimitsSelectOptions();
                track option.value
              ) {
                <ui-select-option
                  [label]="option.label"
                  [value]="option.value"
                ></ui-select-option>
              }
            </ui-select>
          </div>
          <ui-button
            [disabled]="this.activePageIndex() === 0"
            (click)="this.goToPrevPage()"
            variant="primary"
            prefixIcon="arrow-left-s-line"
          >
          </ui-button>
          <ui-button
            [disabled]="this.endPos() >= this.totalCount()"
            (click)="this.goToNextPage()"
            variant="primary"
            prefixIcon="arrow-right-s-line"
          >
          </ui-button>
        </div>
      </div>
    </div>
  }`,
  standalone: true,
  imports: [
    DropdownMenuComponent,
    ButtonComponent,
    AngularRemixIconComponent,
    SelectComponent,
    SelectOptionComponent,
  ],
})
export class PaginatorComponent implements OnChanges {
  initialPageIndex = input<number>(0);
  initialPageLimit = input<number>(10);
  availablePageLimits = input<number[]>([10, 25, 50, 100]);
  totalCount = input<number>(0);

  activePageIndex = signal<number>(0);
  activePageLimit = signal<number>(this.availablePageLimits()[0]);

  @Output()
  readonly pageChange = new EventEmitter<PageChangeEvent>();

  protected availablePageLimitsSelectOptions: Signal<SelectOption<number>[]> =
    computed(() => {
      return this.availablePageLimits().map((limit) => ({
        label: `${limit}`,
        value: limit,
      }));
    });

  protected readonly startPos = computed(() => {
    return this.activePageIndex() * this.activePageLimit() + 1;
  });

  protected endPos = computed(() => {
    return Math.min(
      (this.activePageIndex() + 1) * this.activePageLimit(),
      this.totalCount(),
    );
  });

  public ngOnChanges(
    changes: SimpleChangesTyped<
      Pick<this, 'initialPageIndex' | 'initialPageLimit'>
    >,
  ): void {
    if (
      changes.initialPageIndex &&
      changes.initialPageIndex.currentValue !==
        changes.initialPageIndex.previousValue
    ) {
      this.activePageIndex.set(this.initialPageIndex());
    }

    if (
      changes.initialPageLimit &&
      changes.initialPageLimit.currentValue !==
        changes.initialPageLimit.previousValue
    ) {
      this.activePageLimit.set(this.initialPageLimit());
    }
  }

  public goToPrevPage(): void {
    if (this.activePageIndex() > 0)
      this.updateActivePageIndex(this.activePageIndex() - 1);
  }

  public goToNextPage(): void {
    if (this.endPos() < this.totalCount())
      this.updateActivePageIndex(this.activePageIndex() + 1);
  }

  public updateActivePageIndex(number: number): void {
    this.activePageIndex.set(number);
    this.notifyPageChange();
  }

  private notifyPageChange(): void {
    this.pageChange.emit({
      index: this.activePageIndex(),
      limit: this.activePageLimit(),
      offset: this.activePageIndex() * this.activePageLimit(),
    });
  }
}

export interface PageChangeEvent {
  limit: number;
  offset: number;
  index: number;
}
