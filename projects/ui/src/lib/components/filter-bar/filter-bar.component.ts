import { A11yModule } from '@angular/cdk/a11y';
import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  isSignal,
  Signal,
} from '@angular/core';
import { createSignal } from '@angular/core/primitives/signals';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { isObservable } from 'rxjs';
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
        <ui-dropdown>
          <div
            tabindex="0"
            class="min-w-[160px] max-w-[180px] rounded-xl border border-gray-300 filter-item px-2 py-1 cursor-pointer focus-visible-outline"
          >
            <header class="flex">
              <div class="text-sm font-medium text-gray-500">
                {{ filter.label }}
              </div>
            </header>
            <div class="flex justify-between">
              <div>All</div>
              <rmx-icon
                class="!w-5 !h-5 transform-gpu duration-300"
                name="arrow-down-s-line"
              ></rmx-icon>
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
              <div>
                <ul class="flex flex-col gap-4" cdkMenu>
                  @for (value of filter.values(); track value; let i = $index) {
                    <li>
                      <ui-checkbox
                        cdkMenuItem
                        [label]="value.label"
                      ></ui-checkbox>
                    </li>
                  }
                </ul>
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
      .filter-item {
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
  ],
})
export class FilterBarComponent {
  filters = input.required<Filter[]>({});

  filtersEnriched: Signal<FiltersEnriched[]> = computed(() => {
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
      };
    });
  });

  constructor() {
    isObservable(this.filters);
  }
}

export type FiltersEnriched<ValueType = unknown> = Omit<
  Filter<ValueType>,
  'values'
> & {
  values: Signal<FilterValue<ValueType>[]>;
};
