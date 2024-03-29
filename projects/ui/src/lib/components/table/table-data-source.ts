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
  protected externalTriggers$;

  readonly #isLoadingSignal = signal<boolean>(false);
  public readonly isLoading = this.#isLoadingSignal.asReadonly();

  readonly #isEmptySignal = signal<boolean>(false);
  public readonly isEmpty = this.#isEmptySignal.asReadonly();

  readonly #totalCountSignal = signal<number>(0);
  public readonly totalCount = this.#totalCountSignal.asReadonly();

  readonly #dataFetchedSignal = signal<boolean>(false);
  public readonly dataFetched = this.#dataFetchedSignal.asReadonly();

  readonly #subs = new Subscription();

  public constructor(
    dataFetcher: TableDataFetcher<DataType>,
    sortChange?: Observable<TableSortState | undefined>,
    pageChange?: Observable<TablePaginationState | undefined>,
    externalTriggers?: Observable<Record<string, unknown>>,
  ) {
    super();
    this.dataFetcher = dataFetcher;
    this.sortChange$ = sortChange ?? of(undefined);
    this.pageChange$ = pageChange ?? of(undefined);
    this.externalTriggers$ = externalTriggers ?? of(undefined);
  }

  public connect() {
    return combineLatest([
      this.sortChange$,
      this.pageChange$,
      this.externalTriggers$,
    ]).pipe(
      tap({
        next: () => {
          this.#isLoadingSignal.set(true);
        },
      }),
      switchMap(([sort, pagination, externalTriggers]) =>
        this.dataFetcher({ sort, pagination, externalTriggers }),
      ),
      tap({
        next: (res) => {
          this.#dataFetchedSignal.set(true);
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

  public disconnect() {
    this.#subs.unsubscribe();
  }
}
