import { AsyncPipe } from '@angular/common';
import {
  Component,
  inject,
  Signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { EnvironmentsService } from '@app/services/environments/environments.service';
import { FeatureService } from '@app/services/features/feature.service';
import { Feature, FeatureSortBy } from '@app/types/feature.type';
import { HotToastService } from '@ngneat/hot-toast';
import {
  ButtonComponent,
  CheckboxComponent,
  DropdownMenuComponent,
  ModalDataType,
  ModalService,
  ModalSize,
  SheetService,
  TableColumnConfig,
  TableComponent,
  TableDefaultCellType,
  ToggleComponent,
} from '@ui/components';
import { filter, switchMap } from 'rxjs';
import { SheetSize } from '../../../../projects/ui/src/lib/components/sheet/sheet.type';
import { ActionCellTemplateContext } from '../../../../projects/ui/src/lib/components/table/cell-templates/actions-cell-template.component';
import { TableDataSource } from '../../../../projects/ui/src/lib/components/table/table-data-source';
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
    <div>
      <ui-table
        class="h-full min-h-0 block"
        [columns]="this.columns"
        [dataSource]="this.dataSource"
      ></ui-table>
    </div>

    <ng-template #toggleFeatureValueTemplate let-feature>
      <div class="text-gray-500">
        <div>
          <span class="text-gray-800 font-medium">
            {{ feature?.key }}
          </span>
          will be
          <span
            class="font-medium"
            [class.text-red-500]="feature?.value"
            [class.text-green-600]="!feature?.value"
          >
            {{ feature?.value ? 'Disabled' : 'Enabled' }}
          </span>
          for
          <span class="text-gray-800 font-medium">
            {{ (this.activeEnvironment$ | async)?.name }}
          </span>
          environment.
        </div>
      </div>
    </ng-template>
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
  ],
})
export class FeaturesListComponent {
  protected readonly columns: TableColumnConfig[] = [
    {
      id: 'key',
      label: 'Feature',
      sortable: true,
      width: 15,
      type: TableDefaultCellType.TextWithCopy,
    },
    {
      id: 'description',
      label: 'Description',
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
  protected readonly dataSource;

  public readonly toggleFeatureValueTemplate: Signal<
    TemplateRef<{
      $implicit: Feature;
    }>
  > = viewChild.required<
    TemplateRef<{
      $implicit: Feature;
    }>
  >('toggleFeatureValueTemplate');

  readonly activeEnvironment$ = inject(EnvironmentsService).activeEnvironment$;

  readonly #sheetService = inject(SheetService);
  readonly #featuresService = inject(FeatureService);
  readonly #modalService = inject(ModalService);
  readonly #toast = inject(HotToastService);

  constructor() {
    this.dataSource = new TableDataSource<Feature>(({ sort }) => {
      return this.#featuresService.getFeatures({
        sort: {
          key: sort?.column?.id as FeatureSortBy,
          direction: sort?.direction,
        },
      });
    });
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
}
