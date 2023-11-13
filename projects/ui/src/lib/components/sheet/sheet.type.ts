export interface SheetConfig {
  title?: string;
  size?: SheetSize;
}

export const enum SheetSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  ExtraLarge = 'extra-large',
}
