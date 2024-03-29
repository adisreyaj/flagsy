import {
  computed,
  Directive,
  inject,
  Injector,
  input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { get } from 'lodash-es';
import { TableColumnConfig, TableDefaultCellType } from '../table.types';
import { ActionsCellTemplateComponent } from './actions-cell-template.component';
import {
  CELL_CONTEXT,
  CELL_DATA,
  DATA_TRANSFORMER,
  ROW_DATA,
} from './cell.type';
import { DateCellTemplateComponent } from './date-cell-template.component';
import { TextCellTemplateComponent } from './text-cell-template.component';
import { TextWithCopyCellTemplateComponent } from './text-with-copy-cell-template.component';
import { UserCellTemplateComponent } from './user-cell-template.component';

@Directive({
  selector: '[uiCellTemplate]',
  standalone: true,
})
export class CellTemplateDirective implements OnInit {
  public column = input.required<TableColumnConfig>({
    alias: 'uiCellTemplate',
  });
  public rowData = input.required<Record<string, unknown>>();

  readonly #data = computed(() => {
    return get(this.rowData(), this.column().id);
  });

  readonly #vcr = inject(ViewContainerRef);

  public ngOnInit() {
    this.#vcr.clear();
    if (!this.column()) return;

    const componentOrTemplateRef = this.#getColumnComponent(this.column());
    if (componentOrTemplateRef instanceof TemplateRef) {
      this.#vcr.createEmbeddedView(componentOrTemplateRef);
    } else if (componentOrTemplateRef) {
      this.#vcr.createComponent(componentOrTemplateRef, {
        injector: this.#getInjector(),
      });
    }
  }

  #getColumnComponent(columnConfig: TableColumnConfig) {
    if (columnConfig.content) {
      return columnConfig.content;
    }
    switch (columnConfig.type) {
      case TableDefaultCellType.Date:
        return DateCellTemplateComponent;

      case TableDefaultCellType.TextWithCopy:
        return TextWithCopyCellTemplateComponent;

      case TableDefaultCellType.User:
        return UserCellTemplateComponent;

      case TableDefaultCellType.Actions:
        return ActionsCellTemplateComponent;

      default:
        return TextCellTemplateComponent;
    }
  }

  #getInjector() {
    return Injector.create({
      providers: [
        {
          provide: CELL_DATA,
          useValue: this.#data(),
        },
        {
          provide: ROW_DATA,
          useValue: this.rowData(),
        },
        {
          provide: CELL_CONTEXT,
          useValue: this.column().context,
        },
        {
          provide: DATA_TRANSFORMER,
          useValue: this.column().transform,
        },
      ],
    });
  }
}
