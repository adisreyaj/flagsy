import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ChangelogService } from '@app/services/changelog/changelog.service';
import { EnvironmentsService } from '@app/services/environments/environments.service';
import { FeatureChangelogSortKey } from '@app/types/changelog.type';
import {
  FilterBarComponent,
  TableColumnConfig,
  TableComponent,
  TableDefaultCellType,
} from '@ui/components';
import { Filter } from '@ui/types';
import { map } from 'rxjs';
import { TableDataSource } from '../../../../projects/ui/src/lib/components/table/table-data-source';
import { FeatureChangeCellTemplateComponent } from '../../shared/components/feature-change-cell-template/feature-change-cell-template.component';
import { PageHeaderComponent } from '../../shared/components/header/page-header.component';

@Component({
  selector: `app-changelog`,
  template: `
    <div class="flex flex-col h-full">
      <app-page-header></app-page-header>

      <section class="flex-1 flex flex-col p-4 gap-4">
        <header class="">
          <ui-filter-bar [filters]="this.filters"></ui-filter-bar>
        </header>
        <div class=" flex-1">
          <ui-table
            class="h-full min-h-0 block"
            [columns]="this.columns"
            [dataSource]="this.dataSource"
          ></ui-table>
        </div>
      </section>
    </div>
  `,
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
    },
    {
      id: 'change',
      label: 'Change',
      width: 35,
      content: FeatureChangeCellTemplateComponent,
    },
    {
      id: 'owner',
      label: 'User',
      width: 15,
    },
    {
      id: 'date',
      label: 'Date',
      width: 15,
      sortable: true,
      sortDirection: 'desc',
      type: TableDefaultCellType.Date,
    },
  ];
  protected readonly dataSource;
  readonly #environmentService = inject(EnvironmentsService);
  readonly #changelogService = inject(ChangelogService);
  constructor() {
    this.filters = [
      {
        field: 'Environment',
        label: 'Environment',
        values: this.#environmentService.environments().map((env) => ({
          value: env.id,
          label: env.name,
        })),
      },
    ];

    this.dataSource = new TableDataSource(({ sort }) => {
      return this.#changelogService
        .getChangelogs({
          sort: {
            key: sort?.column?.id as FeatureChangelogSortKey,
            direction: sort?.direction,
          },
        })
        .pipe(
          map((data) => {
            return {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              data: (data as any[]).map((item) => ({
                feature: item.feature.key,
                environment: item.environment.name,
                change: item.change,
                owner: `${item.owner.firstName} ${item.owner.lastName}`,
                date: item.createdAt,
              })),
              total: 1,
            };
          }),
        );
    });
  }
}
