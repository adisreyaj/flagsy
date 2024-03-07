import { TableSortDirection } from '@ui/components';
import { isNil } from 'lodash-es';

export function isNotUndefined<T>(data: T | undefined): data is T {
  return !isNil(data);
}

export interface SortBy<KeyType = string> {
  key?: KeyType;
  direction?: TableSortDirection;
}
