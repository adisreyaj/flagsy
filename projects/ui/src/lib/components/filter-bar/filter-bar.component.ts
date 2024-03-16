import { A11yModule } from '@angular/cdk/a11y';
import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  input,
  isSignal,
  Output,
  signal,
  Signal,
} from '@angular/core';
import { createSignal } from '@angular/core/primitives/signals';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { Filter, FilterValue } from '../../types/filter';
import { ButtonComponent } from '../button/button.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import {
  DropdownComponent,
  DropdownContentDirective,
} from '../dropdown/dropdown.component';
import { InputComponent } from '../input/input.component';
import { SelectComponent } from '../select';

@Component({
  selector: 'ui-filter-bar',
  template: `
    <div class="filter-bar flex gap-2">
      @for (filter of this.filtersEnriched(); track filter.field) {
        <ui-dropdown #dropdown>
          <div
            tabindex="0"
            class="min-w-[160px] max-w-[180px] rounded-xl border border-gray-300 filter-item px-2 py-1 cursor-pointer focus-visible-outline"
            [class.filter-applied]="filter.selectedValues.size > 0"
          >
            <header class="flex justify-between items-center gap-2">
              <div class="text-xs font-medium text-gray-500">
                {{ filter.label }}
              </div>
              <rmx-icon
                class="!w-5 !h-5 transform-gpu duration-300"
                name="arrow-down-s-line"
              ></rmx-icon>
            </header>
            <div class="flex justify-between">
              <div
                class="flex gap-1 items-center justify-between text-sm h-6 w-full"
              >
                <p class="flex-auto text-ellipsis">
                  {{ this.valuesToString(filter.selectedValues) }}
                </p>
                @if (filter.selectedValues.size > 1) {
                  <p
                    class="text-xs font-semibold flex-shrink-0 bg-primary-600 text-white px-1 rounded-lg"
                  >
                    <span class="text-sm">+</span>
                    {{ filter.selectedValues.size - 1 }}
                  </p>
                }
              </div>
            </div>

            <div *uiDropdownContent class="flex flex-col gap-4 w-[200px]">
              @if (filter.values().length > 5) {
                <header class="flex flex-col gap-2">
                  <ui-input
                    prefixIcon="search-line"
                    placeholder="Search"
                  ></ui-input>
                  <div class="flex items-center justify-between"></div>
                  <hr class="text-gray-200" />
                </header>
              }
              <div
                class="flex justify-between items-center gap-2 pb-2 border-b border-gray-200"
              >
                <ui-button
                  variant="plain"
                  size="sm"
                  label="Select All"
                  class="w-fit self-end text-primary-500"
                  (click)="this.selectAll(filter)"
                ></ui-button>
                @if (
                  filter.tempSelectedValues.size > 0 ||
                  filter.selectedValues.size > 0
                ) {
                  <ui-button
                    variant="destructive"
                    size="sm"
                    label="Clear"
                    class="w-fit self-end"
                    (click)="this.clearSelection(filter)"
                  ></ui-button>
                }
              </div>
              <div class="flex flex-col gap-4">
                <ul class="flex flex-col gap-4" cdkMenu>
                  @for (
                    item of filter.values();
                    track item.value;
                    let i = $index
                  ) {
                    <li>
                      <ui-checkbox
                        cdkFocusInitial
                        cdkMenuItem
                        [checked]="
                          filter.tempSelectedValues.has(item) ||
                          filter.selectedValues.has(item)
                        "
                        (checkedChange)="
                          this.updateSelectedValues(filter, item, $event)
                        "
                        [label]="item.label"
                      ></ui-checkbox>
                    </li>
                  }
                </ul>
                <footer>
                  <ui-button
                    size="sm"
                    label="Apply Filter"
                    (click)="this.applyFilter(filter); dropdown.close()"
                  ></ui-button>
                </footer>
              </div>
            </div>
          </div>
        </ui-dropdown>
      }
    </div>
  `,
  styles: [
    //language=scss
    `
      .filter-applied {
        @apply bg-primary-50 border-primary-500;
      }
    `,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SelectComponent,
    AngularRemixIconComponent,
    InputComponent,
    CheckboxComponent,
    A11yModule,
    DropdownContentDirective,
    DropdownComponent,
    ButtonComponent,
    CdkMenu,
    CdkMenuItem,
    ReactiveFormsModule,
    JsonPipe,
  ],
})
export class FilterBarComponent {
  filters = input.required<Filter[]>({});
  filtersEnriched: Signal<FiltersEnriched[]>;

  filtersApplied = signal<FiltersEnriched[]>([]);

  @Output()
  filterChange = new EventEmitter<FilterWithSelection[]>();

  constructor() {
    this.filtersEnriched = this.getFiltersEnriched();
  }

  public applyFilter(filter: FiltersEnriched): void {
    filter.selectedValues = new Set(filter.tempSelectedValues);
    const filterNotApplied =
      this.filtersApplied().findIndex((f) => f.field === filter.field) === -1;
    if (filterNotApplied) {
      this.filtersApplied.set([...this.filtersApplied(), filter]);
    }
    this.notifyFilterChange();
  }

  private getFiltersEnriched(): Signal<FiltersEnriched[]> {
    return computed(() => {
      return this.filters().map((filter) => {
        const getValue = (): Signal<FilterValue<unknown>[]> => {
          if (isSignal(filter.values)) {
            return filter.values;
          } else if (typeof filter.values === 'function') {
            return filter.values({
              search: '',
              sortBy: '',
              sortOrder: '',
              limit: 0,
            });
          } else {
            return createSignal(filter.values);
          }
        };
        return {
          field: filter.field,
          label: filter.label,
          values: getValue(),
          selectedValues: new Set(),
          tempSelectedValues: new Set(),
        };
      });
    });
  }

  public updateSelectedValues(
    filter: FiltersEnriched,
    item: FilterValue<unknown>,
    isSelected: boolean,
  ): void {
    if (isSelected) {
      filter.tempSelectedValues.add(item);
    } else {
      filter.tempSelectedValues.delete(item);
    }
  }

  public valuesToString = (selectedValues: Set<FilterValue<unknown>>) => {
    return selectedValues.size === 0
      ? 'All'
      : selectedValues.values().next().value.label;
  };

  private notifyFilterChange(): void {
    this.filterChange.emit(
      this.filtersApplied().map((filter) => {
        return {
          filter,
          selectedValues: Array.from(filter.selectedValues).map(
            (filter) => filter.value,
          ),
        };
      }),
    );
  }

  public clearSelection(filter: FiltersEnriched): void {
    filter.tempSelectedValues.clear();
    filter.selectedValues.clear();
  }

  public selectAll(filter: FiltersEnriched): void {
    filter.values().forEach((value) => filter.tempSelectedValues.add(value));
  }
}

export type FiltersEnriched<ValueType = unknown> = Omit<
  Filter<ValueType>,
  'values'
> & {
  values: Signal<FilterValue<ValueType>[]>;
  selectedValues: Set<FilterValue<ValueType>>;
  tempSelectedValues: Set<FilterValue<ValueType>>;
};

export interface FilterWithSelection<ValueType = unknown> {
  filter: Filter;
  selectedValues: ValueType[];
}
