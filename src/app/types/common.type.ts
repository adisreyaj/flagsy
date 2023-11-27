import { isNil } from 'lodash-es';

export function isNotUndefined<T>(data: T | undefined): data is T {
  return !isNil(data);
}
