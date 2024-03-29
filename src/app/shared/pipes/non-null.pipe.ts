import { Pipe, PipeTransform } from '@angular/core';
import { isNil } from 'lodash-es';

@Pipe({
  name: 'nonNull',
  standalone: true,
  pure: true,
})
export class NonNullPipe implements PipeTransform {
  public transform<T = unknown>(value: T | null): T | undefined {
    return isNil(value) ? undefined : (value as T);
  }
}
