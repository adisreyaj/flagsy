import { Component, inject } from '@angular/core';
import { TextDisplayPipe } from '../../../pipes/text-display.pipe';
import { CellData } from './cell.type';

@Component({
  selector: 'ui-text-cell-template',
  template: `
    <div
      class="flex items-center flex-wrap w-full h-full text-sm px-2 text-ellipsis"
    >
      <div class="line-clamp-1 min-w-0">
        {{ this.cellData | textDisplay }}
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        width: 100%;
      }
    `,
  ],
  standalone: true,
  imports: [TextDisplayPipe],
})
export class TextCellTemplateComponent {
  protected cellData = inject<string>(CellData);
}
