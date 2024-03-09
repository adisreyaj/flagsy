import { DataSource } from '@angular/cdk/collections';
import { signal } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  isObservable,
  map,
  Observable,
  of,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { TableSortState } from './table.types';

export class TableDataSource<DataType = unknown> extends DataSource<DataType> {
  protected dataFetcher: TableDataFetcher<DataType>;
  protected sortChangeSubject = new BehaviorSubject<TableSortState | undefined>(
    undefined,
  );
  readonly #isLoadingSignal = signal<boolean>(false);
  readonly isLoading = this.#isLoadingSignal.asReadonly();

  readonly #isEmptySignal = signal<boolean>(true);
  readonly isEmpty = this.#isEmptySignal.asReadonly();

  readonly #subs = new Subscription();

  constructor(dataFetcher: TableDataFetcher<DataType>) {
    super();
    this.dataFetcher = dataFetcher;
  }

  connect() {
    return this.sortChangeSubject.pipe(
      tap({
        next: () => {
          this.#isLoadingSignal.set(true);
        },
      }),
      switchMap((sort) => this.dataFetcher({ sort })),
      tap({
        next: () => {
          this.#isLoadingSignal.set(false);
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

  setSortChangeListener(sortChange?: Observable<TableSortState | undefined>) {
    if (isObservable(sortChange))
      this.#subs.add(
        sortChange.subscribe((sort) => this.sortChangeSubject.next(sort)),
      );
  }

  disconnect() {
    this.#subs.unsubscribe();
  }
}

export type TableDataFetcher<TableData> = (req: {
  sort?: TableSortState;
}) => Observable<{
  data: TableData[];
  total: number;
}>;
