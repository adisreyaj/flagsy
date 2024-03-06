import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CellData } from './cell.type';

@Component({
  selector: 'ui-date-cell-template',
  template: `
    <div class="flex items-center">
      {{ this.cellData | date: 'MMM-dd-yyyy hh:mm a' }}
    </div>
  `,
  standalone: true,
  imports: [DatePipe],
})
export class DateCellTemplateComponent {
  protected cellData = inject<Date>(CellData);
}
