import { Component, inject } from '@angular/core';
import { TextDisplayPipe } from '../../../pipes/text-display.pipe';
import { CellData } from './cell.type';

@Component({
  selector: 'ui-text-cell-template',
  template: `
    <div class="flex items-center w-full h-full text-sm px-2">
      {{ this.cellData | textDisplay }}
    </div>
  `,
  standalone: true,
  imports: [TextDisplayPipe],
})
export class TextCellTemplateComponent {
  protected cellData = inject<string>(CellData);
}
