import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkRow,
  CdkRowDef,
  CdkTable,
} from '@angular/cdk/table';
import { NgIf } from '@angular/common';
import {
  Component,
  computed,
  effect,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { CellTemplateDirective } from './cell-templates/cell-template.component';
import { TableDataSource } from './table-data-source';
import { TableColumnConfig, TableSortState } from './table.types';

export enum TableSortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

@Component({
  selector: 'ui-table',
  template: `
    <cdk-table
      class="flex flex-col overflow-y-auto border border-gray-200 rounded-xl"
      [dataSource]="this.dataSource()"
    >
      @for (column of this.columns(); track column.id) {
        <ng-container [cdkColumnDef]="column.id">
          <cdk-header-cell
            *cdkHeaderCellDef
            class="flex px-2 py-1 justify-between items-center group"
            [class.cursor-pointer]="column.sortable"
            (click)="column.sortable && this.sort(column)"
          >
            <div class="flex items-center">{{ column.label }}</div>
            <div class="focus-visible-outline cursor-pointer">
              <!-- Icon shown on hover -->
              <rmx-icon
                *ngIf="column.sortable && this.activeSortColumn() !== column.id"
                class="group-hover:!block !hidden !w-4 !h-4 rotate-180 text-gray-400"
                name="arrow-down-line"
              ></rmx-icon>

              <!-- Icon shown when column is sorted -->
              <rmx-icon
                *ngIf="column.sortable && this.activeSortColumn() === column.id"
                [class.rotate-180]="
                  this.activeSortDirection() === '${TableSortDirection.Asc}'
                "
                class="!w-4 !h-4 text-primary-500 transition-all duration-300"
                name="arrow-down-line"
              ></rmx-icon>
            </div>
          </cdk-header-cell>
          <cdk-cell class="flex px-2 py-1" *cdkCellDef="let rowData">
            <ng-container
              [uiCellTemplate]="column"
              [data]="rowData[column.id]"
            ></ng-container>
          </cdk-cell>
        </ng-container>
      }

      <cdk-header-row
        class="grid text-sm font-semibold text-gray-500 h-10 w-full bg-gray-100 border-b border-gray-200"
        [style.grid-template-columns]="this.rowGridStyles()"
        *cdkHeaderRowDef="this.displayedColumns()"
      ></cdk-header-row>
      <cdk-row
        class="grid w-full  min-h-[40px]"
        [style.grid-template-columns]="this.rowGridStyles()"
        *cdkRowDef="let row; columns: this.displayedColumns()"
      ></cdk-row>
    </cdk-table>
  `,
  styles: [
    //language=scss
    `
      cdk-header-cell,
      cdk-cell {
        &:not(:last-child) {
          @apply border-r border-gray-200;
        }
      }
    `,
  ],
  standalone: true,
  imports: [
    CdkHeaderCell,
    CdkCell,
    CdkCellDef,
    CdkHeaderCellDef,
    CdkColumnDef,
    CdkTable,
    CdkHeaderRow,
    CdkRow,
    CdkRowDef,
    CdkHeaderRowDef,
    AngularRemixIconComponent,
    NgIf,
    CellTemplateDirective,
  ],
})
export class TableComponent implements OnInit {
  columns = input.required<TableColumnConfig[]>();
  dataSource = input.required<TableDataSource<unknown>>();
  rowGridStyles = computed(() => {
    return this.columns()
      .reduce((acc, col) => {
        if (col.width !== undefined) {
          return [
            ...acc,
            col.minWidthInPx
              ? `minmax(${col.minWidthInPx}, ${col.width})`
              : `${col.width}%`,
          ];
        }
        return [...acc, '1fr'];
      }, [] as string[])
      .join(' ');
  });

  sortState = signal<TableSortState | undefined>(undefined);
  activeSortColumn = computed(() => this.sortState()?.column?.id);
  activeSortDirection = computed(() => this.sortState()?.direction);
  #sortState$ = toObservable(this.sortState);

  displayedColumns = computed(() =>
    this.columns().reduce((acc, col) => {
      if (col.visible ?? true) {
        return [...acc, col.id];
      }
      return acc;
    }, [] as string[]),
  );

  constructor() {
    effect(() => {
      this.dataSource().setSortChangeListener(this.#sortState$);
    });
  }

  ngOnInit() {
    const colWithDefaultSortApplied = this.columns().find(
      (col) => col.sortable && col.sortDirection !== undefined,
    );

    if (colWithDefaultSortApplied) {
      this.sortState.set({
        column: colWithDefaultSortApplied,
        direction:
          colWithDefaultSortApplied.sortDirection! as TableSortDirection,
      });
    }
  }

  public sort(column: TableColumnConfig): void {
    const nextSortDirection = this.getNextSortDirection(
      this.sortState()?.direction,
    );

    this.sortState.set({
      column: nextSortDirection === undefined ? undefined : column,
      direction: this.getNextSortDirection(this.sortState()?.direction),
    });
  }

  private getNextSortDirection(
    direction?: TableSortDirection,
  ): TableSortDirection | undefined {
    switch (direction) {
      case TableSortDirection.Asc:
        return TableSortDirection.Desc;
      case TableSortDirection.Desc:
        return undefined;
      default:
        return TableSortDirection.Asc;
    }
  }
}
