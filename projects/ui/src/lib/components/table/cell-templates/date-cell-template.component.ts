import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CellData } from './cell.type';

@Component({
  selector: 'ui-date-cell-template',
  template: `
    <div class="flex items-center w-full h-full text-sm px-2">
      <div class="line-clamp-1 min-w-0">
        {{ this.cellData | date: 'dd-MMM-yy hh:mm a' }}
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
  imports: [DatePipe],
})
export class DateCellTemplateComponent {
  protected cellData = inject<Date>(CellData);
}
