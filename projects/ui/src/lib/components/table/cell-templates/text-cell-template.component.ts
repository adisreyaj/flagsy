import { Component, inject } from '@angular/core';
import { TextDisplayPipe } from '../../../pipes/text-display.pipe';
import { RowData } from '../table.types';
import { CELL_DATA, DATA_TRANSFORMER, ROW_DATA } from './cell.type';

@Component({
  selector: 'ui-text-cell-template',
  template: `
    <div
      class="flex items-center flex-wrap w-full h-full text-sm px-2 text-ellipsis"
    >
      <div class="line-clamp-1 min-w-0">
        {{ this.formattedData | textDisplay }}
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
  protected cellData = inject<string>(CELL_DATA);
  protected rowData = inject<Record<string, unknown>>(ROW_DATA);
  protected dataTransformer = inject<TextCellDataTransformer>(DATA_TRANSFORMER);

  protected formattedData: string =
    this.dataTransformer?.(this.cellData, this.rowData) ?? this.cellData;
}

export type TextCellDataTransformer = <TCellData = string, TRowData = RowData>(
  cellData: TCellData,
  rowData: TRowData,
) => string;
