import { InjectionToken } from '@angular/core';

export interface SheetConfig<SheetDataType = unknown> {
  title?: string;
  size?: SheetSize;
  data?: SheetDataType;
}

export const enum SheetSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  ExtraLarge = 'extra-large',
}

export const SHEET_DATA = new InjectionToken<unknown>('Sheet Data');
