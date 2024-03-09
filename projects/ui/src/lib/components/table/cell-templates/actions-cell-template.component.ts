import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../button/button.component';
import {
  DropdownMenuComponent,
  DropdownMenuOption,
} from '../../dropdown-menu/dropdown-menu.component';
import { DropdownComponent } from '../../dropdown/dropdown.component';
import { CELL_CONTEXT, ROW_DATA } from './cell.type';

@Component({
  selector: 'ui-action-cell-template',
  template: ` <div>
    <ui-dropdown-menu
      [options]="this.cellContext"
      (optionClick)="this.handleClick($event)"
    >
      <ui-button
        class="aspect-square"
        variant="icon"
        size="sm"
        prefixIcon="more-fill"
      ></ui-button>
    </ui-dropdown-menu>
  </div>`,
  styles: [
    `
      :host {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
  standalone: true,
  imports: [DropdownComponent, DropdownMenuComponent, ButtonComponent],
})
export class ActionsCellTemplateComponent {
  protected cellContext = inject<ActionCellTemplateContext[]>(CELL_CONTEXT);
  protected rowData = inject<unknown[]>(ROW_DATA);

  public handleClick(option: DropdownMenuOption): void {
    const optionClickHandler = this.cellContext.find(
      (c) => c.label === option.label,
    )?.onClick;
    optionClickHandler?.(option, this.rowData);
  }
}

export interface ActionCellTemplateContext extends DropdownMenuOption {
  onClick: <RowData = unknown>(
    item: DropdownMenuOption,
    rowData: RowData,
  ) => void;
}
