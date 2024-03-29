import { Pipe, PipeTransform } from '@angular/core';
import { isBoolean, isEmpty, isNumber, isString } from 'lodash-es';

@Pipe({ name: 'textDisplay', standalone: true })
export class TextDisplayPipe implements PipeTransform {
  public transform(value?: string | number | boolean): string {
    if (isNumber(value)) return value?.toString() ?? '-';
    if (isBoolean(value)) return value ? 'true' : 'false';
    if (isString(value)) {
      return !isEmpty(value?.trim()) ? value?.trim() : '-';
    }
    return '-';
  }
}
