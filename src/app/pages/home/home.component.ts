import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ChangelogService } from '@app/services/changelog/changelog.service';
import { FeatureService } from '@app/services/features/feature.service';
import { FeatureChangelogSortKey } from '@app/types/changelog.type';
import { Feature, FeatureSortBy } from '@app/types/feature.type';
import {
  ButtonComponent,
  TableColumnConfig,
  TableComponent,
  TableDataFetcher,
  TableDefaultCellType,
  TableSortDirection,
} from '@ui/components';
import { combineLatest, map, switchMap, take } from 'rxjs';
import { AppRoutes } from '../../config/routes/app.routes';
import { FeatureChangeCellTemplateComponent } from '../../shared/components/feature-change-cell-template/feature-change-cell-template.component';
import { PageHeaderComponent } from '../../shared/components/header/page-header.component';
import { FeatureChangelogTableData } from '../changelog/changelog.component';
import { FeaturesListComponent } from '../features/features-list.component';

@Component({
  selector: 'app-home',
  template: ` <div class="flex flex-col h-full w-full">
    <app-page-header class="flex-grow-0"></app-page-header>

    <section class="grid grid-cols-[5fr_7fr] min-h-0 p-4 gap-4">
      <div
        class="border border-gray-200 rounded-xl p-4 pt-2 flex flex-col gap-2 shadow-sm"
      >
        <header class="flex justify-between items-center">
          <h2 class="font-semibold text-sm text-gray-700">Latest Flags</h2>
          <ui-button
            size="xs"
            variant="icon"
            label="View All"
            trailingIcon="arrow-right-line"
            (click)="this.navigateToFeatures()"
          ></ui-button>
        </header>
        <div>
          <ui-table
            class="h-full min-h-0 block"
            [columns]="this.featureTableColumnConfig"
            [data]="this.featureTableDataFetcher"
            [pageable]="false"
          ></ui-table>
        </div>
      </div>
      <div
        class="border border-gray-200 rounded-xl p-4 pt-2 flex flex-col gap-2 shadow-sm"
      >
        <header class="flex justify-between items-center">
          <h2 class="font-semibold text-sm text-gray-700">Recent Changelog</h2>
          <ui-button
            size="xs"
            variant="icon"
            label="View All"
            trailingIcon="arrow-right-line"
            (click)="this.navigateToChangelog()"
          ></ui-button>
        </header>
        <div>
          <ui-table
            class="h-full min-h-0 block"
            [columns]="this.changelogTableColumnConfig"
            [data]="this.changelogTableDataFetcher"
            [pageable]="false"
          ></ui-table>
        </div>
      </div>
    </section>
  </div>`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PageHeaderComponent,
    FeaturesListComponent,
    TableComponent,
    ButtonComponent,
    RouterLink,
  ],
})
export class HomeComponent {
  protected readonly featureTableColumnConfig: TableColumnConfig[] = [
    {
      id: 'key',
      label: 'Feature',
      sortable: true,
      minWidthInPx: 100,
      type: TableDefaultCellType.TextWithCopy,
    },
    {
      id: 'updatedAt',
      label: 'Update At',
      sortable: true,
      sortDirection: 'desc',
      minWidthInPx: 200,
      type: TableDefaultCellType.Date,
    },
  ];

  protected readonly changelogTableColumnConfig: TableColumnConfig[] = [
    {
      id: 'feature',
      label: 'Feature',
      sortable: true,
      minWidthInPx: 100,
      type: TableDefaultCellType.TextWithCopy,
    },
    {
      id: 'change',
      label: 'Change',
      minWidthInPx: 200,
      content: FeatureChangeCellTemplateComponent,
    },
    {
      id: 'date',
      label: 'Date',
      minWidthInPx: 160,
      sortable: true,
      sortDirection: 'desc',
      type: TableDefaultCellType.Date,
    },
  ];

  protected readonly featureTableDataFetcher: TableDataFetcher<Feature>;
  protected readonly changelogTableDataFetcher: TableDataFetcher<FeatureChangelogTableData>;

  readonly #featuresService = inject(FeatureService);
  readonly #changelogService = inject(ChangelogService);
  readonly #router = inject(Router);

  public constructor() {
    this.featureTableDataFetcher = () => {
      return combineLatest([
        this.#featuresService.currentProjectId$,
        this.#featuresService.currentEnvironmentId$,
      ]).pipe(
        switchMap(([projectId, environmentId]) =>
          this.#featuresService.getFeatures({
            projectId: projectId,
            environmentId: environmentId,
            pagination: {
              limit: 5,
              offset: 0,
            },
            sort: {
              key: FeatureSortBy.LastUpdated,
              direction: TableSortDirection.Desc,
            },
          }),
        ),
        take(1),
      );
    };

    this.changelogTableDataFetcher = () => {
      return this.#changelogService
        .getChangelogs({
          sort: {
            key: FeatureChangelogSortKey.Date,
            direction: TableSortDirection.Desc,
          },
          pagination: {
            limit: 5,
            offset: 0,
          },
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

  public navigateToFeatures(): void {
    this.#router.navigate(['/', AppRoutes.Features]);
  }

  public navigateToChangelog(): void {
    this.#router.navigate(['/', AppRoutes.Changelog]);
  }
}
