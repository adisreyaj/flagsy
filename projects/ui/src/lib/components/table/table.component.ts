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
import { Component, computed, input, OnInit, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { isString } from 'lodash-es';
import {
  PageChangeEvent,
  PaginatorComponent,
} from '../paginator/paginator.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { CellTemplateDirective } from './cell-templates/cell-template.component';
import { TableDataSource } from './table-data-source';
import {
  TableColumnConfig,
  TableDataFetcher,
  TablePaginationState,
  TableSortState,
} from './table.types';

export enum TableSortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

@Component({
  selector: 'ui-table',
  template: `
    <div class="flex flex-col">
      <div
        class="relative border border-gray-200 rounded-xl overflow-hidden"
        [class.min-h-[200px]]="this.isLoading() || this.isEmpty()"
      >
        @if (this.isLoading()) {
          <div
            class="flex justify-center w-full h-full absolute z-10 bg-white bg-opacity-50 items-center pt-[44px] transition-all duration-300"
          >
            <ui-spinner></ui-spinner>
          </div>
        } @else if (this.isEmpty()) {
          <div
            class="flex justify-center w-full h-full absolute pointer-events-none items-center pt-[44px]"
          >
            <div class="flex items-center gap-2 text-gray-600">
              <rmx-icon name="folder-open-line"></rmx-icon>
              <p>No data</p>
            </div>
          </div>
        }
        <cdk-table
          class="flex flex-col overflow-y-auto w-full"
          [dataSource]="this.dataSource()"
        >
          @for (column of this.columns(); track column.id) {
            <ng-container [cdkColumnDef]="column.id">
              <cdk-header-cell
                *cdkHeaderCellDef
                class="flex px-2 py-1 bg-gray-100 border-b border-gray-200 justify-between items-center group"
                [class.cursor-pointer]="column.sortable"
                (click)="column.sortable && this.sort(column)"
              >
                @if (column.label) {
                  <div class="flex items-center">{{ column.label }}</div>
                }
                <div class="focus-visible-outline cursor-pointer">
                  <!-- Icon shown on hover -->
                  <rmx-icon
                    *ngIf="
                      column.sortable && this.activeSortColumn() !== column.id
                    "
                    class="group-hover:!block !hidden !w-4 !h-4 rotate-180 text-gray-400"
                    name="arrow-down-line"
                  ></rmx-icon>

                  <!-- Icon shown when column is sorted -->
                  <rmx-icon
                    *ngIf="
                      column.sortable && this.activeSortColumn() === column.id
                    "
                    [class.rotate-180]="
                      this.activeSortDirection() === '${TableSortDirection.Asc}'
                    "
                    class="!w-4 !h-4 text-primary-500 transition-all duration-300"
                    name="arrow-down-line"
                  ></rmx-icon>
                </div>
              </cdk-header-cell>
              <cdk-cell class="flex" *cdkCellDef="let rowData">
                <ng-container
                  [uiCellTemplate]="column"
                  [data]="rowData[column.id]"
                  [rowData]="rowData"
                ></ng-container>
              </cdk-cell>
            </ng-container>
          }

          <cdk-header-row
            class="grid text-sm font-semibold text-gray-500 h-10 w-full"
            [style.grid-template-columns]="this.rowGridStyles()"
            *cdkHeaderRowDef="this.displayedColumns()"
          ></cdk-header-row>
          <cdk-row
            class="grid w-full  h-[44px] border-b last-of-type:border-b-0"
            [style.grid-template-columns]="this.rowGridStyles()"
            *cdkRowDef="let row; columns: this.displayedColumns()"
          ></cdk-row>
        </cdk-table>
      </div>
      @if (this.pageable() && !this.isLoading()) {
        <div class="py-2">
          <ui-paginator
            [totalCount]="this.totalCount()"
            [initialPageIndex]="this.initialPageIndex()"
            [initialPageLimit]="this.initialPageLimit()"
            [availablePageLimits]="this.availablePageLimits()"
            (pageChange)="this.pageChange($event)"
          ></ui-paginator>
        </div>
      }
    </div>
  `,
  styles: [
    //language=scss
    `
      :host {
        position: relative;
      }
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
    SpinnerComponent,
    PaginatorComponent,
  ],
})
export class TableComponent implements OnInit {
  columns = input.required<TableColumnConfig[]>();
  data = input.required<TableDataFetcher<unknown>>();

  pageable = input<boolean>(false);
  initialPageIndex = input<number>(0);
  initialPageLimit = input<number>(10);
  availablePageLimits = input<number[]>([10, 25, 50, 100]);

  protected sortState = signal<TableSortState | undefined>(undefined);
  protected paginationState = signal<TablePaginationState>({
    limit: this.initialPageLimit(),
    offset: this.initialPageIndex(),
  });

  protected dataSource = computed(() => {
    const hasSortableColumn = this.columns().some((col) => col.sortable);
    return new TableDataSource(
      this.data(),
      hasSortableColumn ? this.#sortState$ : undefined,
      this.pageable() ? this.#paginationState$ : undefined,
    );
  });

  protected displayedColumns = computed(() =>
    this.columns().reduce((acc, col) => {
      if (col.visible ?? true) {
        return [...acc, col.id];
      }
      return acc;
    }, [] as string[]),
  );

  protected isLoading = computed(() => this.dataSource().isLoading());
  protected isEmpty = computed(() => this.dataSource().isEmpty());

  protected rowGridStyles = computed(() => {
    return this.columns()
      .reduce((acc, col) => {
        if (col.width !== undefined) {
          return [
            ...acc,
            isString(col.width)
              ? col.width
              : col.minWidthInPx
                ? `minmax(${col.minWidthInPx}px, ${col.width}%)`
                : `minmax(auto, ${col.width}%)`,
          ];
        }
        return [...acc, '1fr'];
      }, [] as string[])
      .join(' ');
  });

  protected activeSortColumn = computed(() => this.sortState()?.column?.id);
  protected activeSortDirection = computed(() => this.sortState()?.direction);
  protected totalCount = computed(() => this.dataSource().totalCount() ?? 0);

  #sortState$ = toObservable(this.sortState);
  #paginationState$ = toObservable(this.paginationState);

  constructor() {}

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

  public pageChange(event: PageChangeEvent): void {
    this.paginationState.set({
      offset: event.offset,
      limit: event.limit,
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
