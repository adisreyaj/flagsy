import { DataSource } from '@angular/cdk/collections';
import {
  BehaviorSubject,
  isObservable,
  map,
  Observable,
  Subscription,
  switchMap,
} from 'rxjs';
import { TableSortState } from './table.types';

export class TableDataSource<DataType = unknown> extends DataSource<DataType> {
  protected dataFetcher: TableDataFetcher<DataType>;
  protected sortChangeSubject = new BehaviorSubject<TableSortState | undefined>(
    undefined,
  );

  #subs = new Subscription();

  constructor(dataFetcher: TableDataFetcher<DataType>) {
    super();
    this.dataFetcher = dataFetcher;
  }

  connect() {
    return this.sortChangeSubject.pipe(
      switchMap((sort) => this.dataFetcher({ sort })),
      map((result) => result.data),
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
