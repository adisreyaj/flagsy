import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ChangelogService } from '@app/services/changelog/changelog.service';
import { EnvironmentsService } from '@app/services/environments/environments.service';
import {
  FeatureChangelogChangeData,
  FeatureChangelogSortKey,
  FeatureChangeLogType,
} from '@app/types/changelog.type';
import { UserMeta } from '@app/types/user.type';
import {
  FilterBarComponent,
  FilterWithSelection,
  TableColumnConfig,
  TableComponent,
  TableDataFetcher,
  TableDefaultCellType,
} from '@ui/components';
import { Filter } from '@ui/types';
import { lowerCase, startCase } from 'lodash-es';
import { BehaviorSubject, map, take } from 'rxjs';
import { FeatureChangeCellTemplateComponent } from '../../shared/components/feature-change-cell-template/feature-change-cell-template.component';
import { PageHeaderComponent } from '../../shared/components/header/page-header.component';
import { FilterUtil } from '../../utils/filter.util';

@Component({
  selector: `app-changelog`,
  template: `
    <div class="flex flex-col h-full w-full">
      <app-page-header class="flex-grow-0"></app-page-header>

      <section class="flex-auto min-h-0 flex flex-col p-4 gap-4">
        <header class="flex-none">
          <ui-filter-bar
            [filters]="this.filters"
            (filterChange)="this.updateTable($event)"
          ></ui-filter-bar>
        </header>
        <div class="flex-auto min-h-0">
          <ui-table
            class="block h-full"
            [externalTriggers]="this.externalTriggers"
            [columns]="this.columns"
            [data]="this.dataFetcher"
            [pageable]="true"
          ></ui-table>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      :host {
        @apply flex h-full w-full;
      }
    `,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, FilterBarComponent, TableComponent],
})
export class ChangelogComponent {
  protected readonly filters: Filter[];

  protected readonly columns: TableColumnConfig[] = [
    {
      id: 'feature',
      label: 'Feature',
      sortable: true,
      width: 20,
      type: TableDefaultCellType.TextWithCopy,
    },
    {
      id: 'environment',
      label: 'Environment',
      width: 15,
      minWidthInPx: 200,
    },
    {
      id: 'change',
      label: 'Change',
      minWidthInPx: 200,
      content: FeatureChangeCellTemplateComponent,
    },
    {
      id: 'owner',
      label: 'User',
      width: 15,
      minWidthInPx: 150,
      type: TableDefaultCellType.User,
    },
    {
      id: 'date',
      label: 'Date',
      width: 15,
      minWidthInPx: 200,
      sortable: true,
      sortDirection: 'desc',
      type: TableDefaultCellType.Date,
    },
  ];
  protected readonly dataFetcher: TableDataFetcher<
    FeatureChangelogTableData,
    ChangelogTableExternalTriggers
  >;

  protected filtersSubject = new BehaviorSubject<FilterWithSelection[]>([]);
  protected externalTriggers = {
    filters: this.filtersSubject.asObservable(),
  };

  readonly #environmentService = inject(EnvironmentsService);
  readonly #changelogService = inject(ChangelogService);

  public constructor() {
    this.filters = [
      {
        field: 'environment',
        label: 'Environment',
        values: this.#environmentService.environments().map((env) => ({
          value: env.id,
          label: env.name,
        })),
      },

      {
        field: 'type',
        label: 'Type',
        values: Object.values(FeatureChangeLogType).map((type) => ({
          value: type,
          label: startCase(lowerCase(type)),
        })),
      },
    ];

    this.dataFetcher = ({ sort, pagination, externalTriggers }) => {
      return this.#changelogService
        .getChangelogs({
          sort: {
            key: sort?.column?.id as FeatureChangelogSortKey,
            direction: sort?.direction,
          },
          pagination,
          filters: FilterUtil.convertToFlatFilter(externalTriggers?.filters),
        })
        .pipe(
          take(1),
          map((res) => {
            return {
              data: res.data.map((item) => {
                const data: FeatureChangelogTableData = {
                  feature: item.feature.key,
                  environment: item.environment?.name,
                  change: item.change,
                  owner: item.owner,
                  date: item.createdAt,
                  type: item.type,
                };
                return data;
              }),
              total: res.total,
            };
          }),
        );
    };
  }

  public updateTable(filters: FilterWithSelection[]): void {
    this.filtersSubject.next(filters ?? []);
  }
}

export interface FeatureChangelogTableData {
  feature: string;
  environment?: string;
  change?: FeatureChangelogChangeData;
  owner: UserMeta;
  date: Date;
  type: FeatureChangeLogType;
}

type ChangelogTableExternalTriggers = {
  filters: FilterWithSelection[];
};
