import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FeatureService } from '@app/services/features/feature.service';
import { Feature, FeatureSortBy } from '@app/types/feature.type';
import { HotToastService } from '@ngneat/hot-toast';
import {
  ButtonComponent,
  CheckboxComponent,
  DropdownMenuComponent,
  InputComponent,
  ModalDataType,
  ModalService,
  ModalSize,
  SheetService,
  TableColumnConfig,
  TableComponent,
  TableDataFetcher,
  TableDefaultCellType,
  ToggleComponent,
} from '@ui/components';
import { isEmpty } from 'lodash-es';
import { BehaviorSubject, filter, map, switchMap, take } from 'rxjs';
import { SheetSize } from '../../../../projects/ui/src/lib/components/sheet/sheet.type';
import { ActionCellTemplateContext } from '../../../../projects/ui/src/lib/components/table/cell-templates/actions-cell-template.component';
import { TimeAgoPipe } from '../../../../projects/ui/src/lib/pipes';
import { FeatureCellTemplateComponent } from '../../shared/components/feature-cell-template/feature-cell-template.component';
import {
  FeatureConfigSheetComponent,
  FeatureConfigSheetData,
  FeatureConfigSheetMode,
} from '../../shared/components/feature-config-sheet/feature-config-sheet.component';

@Component({
  selector: 'app-features-list',
  template: `
    <div class="flex flex-col gap-4">
      <header class="flex justify-between gap-4">
        <ui-input
          class="w-96 block"
          prefixIcon="search-line"
          placeholder="Search by key"
          (inputChange)="this.search($event)"
        ></ui-input>
      </header>
      <ui-table
        class="h-full min-h-0 block"
        [externalTriggers]="this.externalTriggers"
        [columns]="this.columns"
        [data]="this.dataFetcher"
        [pageable]="true"
      ></ui-table>
    </div>
  `,
  styles: `
    .list-item {
      @apply grid gap-3;
      grid-template-columns: 20px 1fr 200px 200px 34px;
      &:not(:last-child) {
        @apply border-b border-gray-200
      }
    }
  `,
  standalone: true,
  imports: [
    DropdownMenuComponent,
    CheckboxComponent,
    AsyncPipe,
    ToggleComponent,
    ButtonComponent,
    TimeAgoPipe,
    TableComponent,
    InputComponent,
  ],
})
export class FeaturesListComponent {
  protected readonly columns: TableColumnConfig[] = [
    {
      id: 'key',
      label: 'Feature',
      sortable: true,
      width: 15,
      minWidthInPx: 100,
      type: TableDefaultCellType.TextWithCopy,
    },
    {
      id: 'description',
      label: 'Description',
      minWidthInPx: 100,
    },
    {
      id: 'value',
      label: 'Value',
      width: 20,
      content: FeatureCellTemplateComponent,
    },
    {
      id: 'createdBy',
      label: 'User',
      width: 15,
      minWidthInPx: 200,
      type: TableDefaultCellType.User,
    },
    {
      id: 'updatedAt',
      label: 'Update At',
      width: 15,
      sortable: true,
      sortDirection: 'desc',
      minWidthInPx: 200,
      type: TableDefaultCellType.Date,
    },
    {
      id: 'actions',
      width: '50px',
      type: TableDefaultCellType.Actions,
      context: [
        {
          label: 'Edit',
          prefixIcon: 'pencil-line',
          onClick: (option, rowData) => this.editFeature(rowData as Feature),
        },
        {
          label: 'Delete',
          variant: 'destructive',
          prefixIcon: 'delete-bin-6-line',
          onClick: (option, rowData) => this.deleteFeature(rowData as Feature),
        },
      ] as ActionCellTemplateContext[],
    },
  ];
  protected readonly dataFetcher: TableDataFetcher<
    Feature,
    FeatureTableExternalTriggers
  >;
  readonly #searchSubject = new BehaviorSubject<string>('');

  readonly #sheetService = inject(SheetService);
  readonly #featuresService = inject(FeatureService);
  readonly #modalService = inject(ModalService);
  readonly #toast = inject(HotToastService);
  public externalTriggers = {
    search: this.#searchSubject.asObservable().pipe(
      map((searchText) => {
        return !isEmpty(searchText)
          ? searchText?.trim()?.toLowerCase()
          : undefined;
      }),
    ),
    refresh: this.#featuresService.refresh$,
    projectId: this.#featuresService.currentProjectId$,
    environmentId: this.#featuresService.currentEnvironmentId$,
  };

  public constructor() {
    this.dataFetcher = ({ sort, externalTriggers }) => {
      return this.#featuresService
        .getFeatures({
          projectId: externalTriggers.projectId,
          environmentId: externalTriggers.environmentId,
          sort: {
            key: sort?.column?.id as FeatureSortBy,
            direction: sort?.direction,
          },
          search: externalTriggers?.search,
        })
        .pipe(take(1));
    };
  }

  protected editFeature(feature: Feature): void {
    this.#sheetService.open<FeatureConfigSheetData>(
      FeatureConfigSheetComponent,
      {
        title: 'Edit Feature Flag',
        size: SheetSize.Large,
        data: {
          type: FeatureConfigSheetMode.Edit,
          feature,
        },
      },
    );
  }

  public deleteFeature(feature: Feature): void {
    this.#modalService
      .openConfirmation({
        title: 'Delete Feature',
        content: `Are you sure you want to delete feature "${feature.key}"?`,
        confirmButtonText: 'Delete',
        confirmButtonVariant: 'destructive',
        cancelButtonText: 'Cancel',
        size: ModalSize.Small,
        dataType: ModalDataType.Danger,
      })
      .pipe(
        filter((result) => result === true),
        switchMap(() => this.#featuresService.deleteFeature(feature.id)),
        this.#toast.observe({
          success: () => 'Feature deleted successfully!',
          error: () => 'Failed to delete feature!',
        }),
      )
      .subscribe();
  }

  public search(searchText: string): void {
    this.#searchSubject.next(searchText);
  }
}

interface FeatureTableExternalTriggers {
  search?: string;
  refresh: void;
  projectId: string;
  environmentId: string;
}
