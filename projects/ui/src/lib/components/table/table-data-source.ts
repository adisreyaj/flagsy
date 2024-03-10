import { DataSource } from '@angular/cdk/collections';
import { signal } from '@angular/core';
import {
  catchError,
  combineLatest,
  map,
  Observable,
  of,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import {
  TableDataFetcher,
  TablePaginationState,
  TableSortState,
} from './table.types';

export class TableDataSource<DataType = unknown> extends DataSource<DataType> {
  protected dataFetcher: TableDataFetcher<DataType>;
  protected sortChange$;
  protected pageChange$;

  readonly #isLoadingSignal = signal<boolean>(false);
  readonly isLoading = this.#isLoadingSignal.asReadonly();

  readonly #isEmptySignal = signal<boolean>(true);
  readonly isEmpty = this.#isEmptySignal.asReadonly();

  readonly #totalCountSignal = signal<number>(0);
  readonly totalCount = this.#totalCountSignal.asReadonly();

  readonly #subs = new Subscription();

  constructor(
    dataFetcher: TableDataFetcher<DataType>,
    sortChange?: Observable<TableSortState | undefined>,
    pageChange?: Observable<TablePaginationState | undefined>,
  ) {
    super();
    this.dataFetcher = dataFetcher;
    this.sortChange$ = sortChange ?? of(undefined);
    this.pageChange$ = pageChange ?? of(undefined);
  }

  connect() {
    return combineLatest([this.sortChange$, this.pageChange$]).pipe(
      tap({
        next: () => {
          this.#isLoadingSignal.set(true);
        },
      }),
      switchMap(([sort, pagination]) => this.dataFetcher({ sort, pagination })),
      tap({
        next: (res) => {
          this.#isLoadingSignal.set(false);
          this.#totalCountSignal.set(res.total);
        },
      }),
      map((result) => result?.data),
      tap((data) => {
        this.#isEmptySignal.set(data?.length === 0);
      }),
      catchError((err) => {
        this.#isLoadingSignal.set(false);
        return of(err);
      }),
    );
  }

  disconnect() {
    this.#subs.unsubscribe();
  }
}
