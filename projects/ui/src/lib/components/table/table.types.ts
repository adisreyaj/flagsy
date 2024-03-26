import { TemplateRef, Type } from '@angular/core';
import { Observable } from 'rxjs';
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

export interface TablePaginationState {
  offset: number;
  limit: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TableDataFetcher<TableData = any, Triggers = any> = (req: {
  sort?: TableSortState;
  pagination?: TablePaginationState;
  externalTriggers: Triggers;
}) => Observable<{
  data: TableData[];
  total: number;
}>;
