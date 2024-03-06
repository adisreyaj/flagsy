import { Signal } from '@angular/core';

export interface Filter<ValueType = unknown> {
  field: string;
  label: string;
  values:
    | FilterValue<ValueType>[]
    | Signal<FilterValue<ValueType>[]>
    | ((args: FilterValueGetArgs) => Signal<FilterValue<ValueType>[]>);
}

export interface FilterValue<ValueType = unknown> {
  label: string;
  value: ValueType;
}

export interface FilterValueGetArgs {
  search: string;
  sortBy: string;
  sortOrder: string;
  limit: number;
}
