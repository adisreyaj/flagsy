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
  ElementRef,
  input,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { isEmpty } from 'lodash-es';
import { combineLatest, filter, fromEvent, Observable, switchMap } from 'rxjs';
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
import { TableUtil } from './table.util';

export enum TableSortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

@Component({
  selector: 'ui-table',
  template: `
    <div class="flex flex-col gap-2 h-full">
      <div
        class="relative border border-gray-200 rounded-xl overflow-auto"
        [class.min-h-[200px]]="
          (!this.dataFetched() && (this.isLoading() || this.isEmpty())) ||
          (this.dataFetched() && this.isEmpty())
        "
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
          #table
          class="flex flex-col w-full"
          [dataSource]="this.dataSource()"
        >
          @for (column of this.columns(); track column.id; let last = $last) {
            <ng-container [cdkColumnDef]="column.id">
              <cdk-header-cell
                *cdkHeaderCellDef
                class="flex px-2 py-1 bg-gray-100 border-b border-gray-200 justify-between items-center group sticky top-0"
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
              <cdk-cell
                class="flex border-b border-gray-200"
                *cdkCellDef="let rowData"
              >
                <ng-container
                  [uiCellTemplate]="column"
                  [rowData]="rowData"
                ></ng-container>
              </cdk-cell>
            </ng-container>
          }

          <cdk-header-row
            class="grid text-sm font-semibold text-gray-500 h-10 w-full sticky top-0"
            [style.grid-template-columns]="this.rowGridStyles()"
            *cdkHeaderRowDef="this.displayedColumns()"
          ></cdk-header-row>
          <cdk-row
            class="grid w-full  h-[44px]"
            [style.grid-template-columns]="this.rowGridStyles()"
            *cdkRowDef="let row; columns: this.displayedColumns()"
          ></cdk-row>
        </cdk-table>
      </div>
      @if (this.pageable()) {
        <div class="py-2">
          <ui-paginator
            [totalCount]="this.totalCount()"
            [initialPageIndex]="this.activePageIndex()"
            [initialPageLimit]="this.activePageLimit()"
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

      cdk-row {
        &:last-of-type {
          cdk-cell {
            @apply border-b-0;
          }
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
  public columns = input.required<TableColumnConfig[]>();
  public data = input.required<TableDataFetcher>();

  // Pagination
  public pageable = input<boolean>(false);
  public initialPageIndex = input<number>(0);
  public initialPageLimit = input<number>(10);
  public availablePageLimits = input<number[]>([10, 25, 50, 100]);

  // External Triggers
  public externalTriggers = input<
    Record<string, Observable<unknown>> | undefined
  >(undefined);

  protected tableElementRef = viewChild('table', {
    read: ElementRef<HTMLDivElement>,
  });

  // Pagination state is managed by the table itself
  protected readonly activePageIndex = signal<number>(0);
  protected readonly activePageLimit = signal<number>(
    this.availablePageLimits()[0],
  );

  readonly #sortState = signal<TableSortState | undefined>(undefined);
  readonly #paginationState = signal<TablePaginationState>({
    limit: this.initialPageLimit(),
    offset: this.initialPageIndex(),
  });

  protected readonly dataSource = computed(() => {
    const hasSortableColumn = this.columns().some((col) => col.sortable);
    return new TableDataSource(
      this.data(),
      hasSortableColumn ? this.#sortState$ : undefined,
      this.pageable() ? this.#paginationState$ : undefined,
      !isEmpty(this.externalTriggers()) ? this.#externalTriggers$ : undefined,
    );
  });
  protected readonly displayedColumns = computed(() =>
    this.columns().reduce((acc, col) => {
      if (col.visible ?? true) {
        return [...acc, col.id];
      }
      return acc;
    }, [] as string[]),
  );

  protected readonly isLoading = computed(() => this.dataSource().isLoading());
  protected readonly isEmpty = computed(() => this.dataSource().isEmpty());
  protected readonly dataFetched = computed(() =>
    this.dataSource().dataFetched(),
  );

  protected readonly activeSortColumn = computed(
    () => this.#sortState()?.column?.id,
  );
  protected readonly activeSortDirection = computed(
    () => this.#sortState()?.direction,
  );
  protected readonly totalCount = computed(
    () => this.dataSource().totalCount() ?? 0,
  );

  protected readonly rowGridStyles = computed(() => {
    return TableUtil.getGridTemplateColumns(
      this.columns(),
      this.#tableWidth() ?? 0,
    );
  });

  readonly #windowResize = toSignal(fromEvent(window, 'resize'), {
    initialValue: undefined,
  });
  readonly #tableWidth = computed(() => {
    this.#windowResize();
    return this.tableElementRef()?.nativeElement.offsetWidth;
  });
  readonly #sortState$ = toObservable(this.#sortState);
  readonly #paginationState$ = toObservable(this.#paginationState);
  readonly #externalTriggers$ = toObservable(this.externalTriggers).pipe(
    filter(
      (triggers): triggers is Record<string, Observable<unknown>> =>
        !isEmpty(triggers),
    ),
    switchMap((triggers) => combineLatest(triggers)),
  );

  public ngOnInit() {
    const colWithDefaultSortApplied = this.columns().find(
      (col) => col.sortable && col.sortDirection !== undefined,
    );

    if (colWithDefaultSortApplied) {
      this.#sortState.set({
        column: colWithDefaultSortApplied,
        direction:
          colWithDefaultSortApplied.sortDirection! as TableSortDirection,
      });
    }
  }

  protected sort(column: TableColumnConfig): void {
    const nextSortDirection = this.#getNextSortDirection(
      this.#sortState()?.direction,
    );

    this.#sortState.set({
      column: nextSortDirection === undefined ? undefined : column,
      direction: this.#getNextSortDirection(this.#sortState()?.direction),
    });
  }

  protected pageChange(event: PageChangeEvent): void {
    this.#paginationState.set({
      offset: event.offset,
      limit: event.limit,
    });
    this.activePageIndex.set(event.index);
    this.activePageLimit.set(event.limit);
  }

  #getNextSortDirection(
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
