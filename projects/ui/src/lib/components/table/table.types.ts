import { TemplateRef, Type } from '@angular/core';
import { TableSortDirection } from './table.component';

export type TableColumnConfig = {
  id: string;
  label?: string;
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc';
  width?: number | `${number}px`;
  visible?: boolean;
  minWidthInPx?: number;
  content?: Type<unknown> | TemplateRef<unknown>;
  context?: unknown;
  type?: TableDefaultCellType;
} & (
  | {
      content: Type<unknown> | TemplateRef<unknown>;
    }
  | { type?: TableDefaultCellType }
);

export enum TableDefaultCellType {
  Text = 'text',
  TextWithCopy = 'text-with-copy',
  Date = 'date',
  User = 'user',
  Actions = 'actions',
}

export interface TableSortState {
  column?: TableColumnConfig;
  direction?: TableSortDirection;
}
