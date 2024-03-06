import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'textDisplay', standalone: true })
export class TextDisplayPipe implements PipeTransform {
  transform(value?: string): string {
    const textTrimmed = value?.trim();
    return textTrimmed ? textTrimmed : '-';
  }
}
