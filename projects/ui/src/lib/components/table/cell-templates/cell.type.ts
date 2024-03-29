import { InjectionToken } from '@angular/core';

export const CELL_DATA = new InjectionToken<unknown>('Cell Data');

export const CELL_CONTEXT = new InjectionToken<unknown>('Cell Context');

export const ROW_DATA = new InjectionToken<unknown>('Row Data');

export const DATA_TRANSFORMER = new InjectionToken<
  (cellData: unknown, rowData: unknown) => unknown
>('Data Transformer');
