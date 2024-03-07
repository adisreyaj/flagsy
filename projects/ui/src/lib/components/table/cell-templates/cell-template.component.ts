import {
  Directive,
  inject,
  Injector,
  input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { TableColumnConfig, TableDefaultCellType } from '../table.types';
import { CellData } from './cell.type';
import { DateCellTemplateComponent } from './date-cell-template.component';
import { TextCellTemplateComponent } from './text-cell-template.component';
import { TextWithCopyCellTemplateComponent } from './text-with-copy-cell-template.component';
import { UserCellTemplateComponent } from './user-cell-template.component';

@Directive({
  selector: '[uiCellTemplate]',
  standalone: true,
})
export class CellTemplateDirective implements OnInit {
  column = input.required<TableColumnConfig>({
    alias: 'uiCellTemplate',
  });
  data = input.required<unknown>();

  #vcr = inject(ViewContainerRef);

  ngOnInit() {
    this.#vcr.clear();
    if (!this.column() || this.data() === undefined) return;

    const componentOrTemplateRef = this.getColumnComponent(this.column());
    if (componentOrTemplateRef instanceof TemplateRef) {
      this.#vcr.createEmbeddedView(componentOrTemplateRef);
    } else if (componentOrTemplateRef) {
      this.#vcr.createComponent(componentOrTemplateRef, {
        injector: this.getInjector(this.data()),
      });
    }
  }

  private getColumnComponent(columnConfig: TableColumnConfig) {
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

      default:
        return TextCellTemplateComponent;
    }
  }

  private getInjector(data: unknown) {
    return Injector.create({
      providers: [
        {
          provide: CellData,
          useValue: data,
        },
      ],
    });
  }
}
