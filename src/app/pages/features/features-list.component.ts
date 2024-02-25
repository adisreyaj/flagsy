import { AsyncPipe } from '@angular/common';
import {
  Component,
  inject,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { EnvironmentsService } from '@app/services/environments/environments.service';
import { FeatureService } from '@app/services/features/feature.service';
import {
  Feature,
  FeatureSortBy,
  FeatureValueType,
} from '@app/types/feature.type';
import { HotToastService } from '@ngneat/hot-toast';
import {
  ButtonComponent,
  CheckboxComponent,
  DropdownComponent,
  DropdownOption,
  ModalService,
  ModalSize,
  SheetService,
  ToggleComponent,
} from '@ui/components';
import { BehaviorSubject, filter, switchMap, withLatestFrom } from 'rxjs';
import { SheetSize } from '../../../../projects/ui/src/lib/components/sheet/sheet.type';
import { TimeAgoPipe } from '../../../../projects/ui/src/lib/pipes';
import {
  FeatureConfigSheetComponent,
  FeatureConfigSheetData,
  FeatureConfigSheetMode,
} from '../../shared/components/feature-config-sheet/feature-config-sheet.component';
import { SelectOption } from '../../shared/components/select.type';

@Component({
  selector: 'app-features-list',
  template: `
    @if (this.features && this.features.length > 0) {
      <ul class="flex flex-col border rounded-xl">
        <li
          class="list-item px-4 py-2 border-b bg-gray-100 border-gray-200 rounded-tl-xl rounded-tr-xl"
        >
          <div class="flex items-center">
            <ui-checkbox></ui-checkbox>
          </div>
          <div>Key</div>
          <div>Value</div>
          <div>Last Updated</div>
        </li>
        @for (feature of this.features; track feature.id; let index = $index) {
          <li class="list-item w-full justify-between items-center p-4">
            <div class="flex items-center">
              <ui-checkbox></ui-checkbox>
            </div>
            <div
              (keyup.enter)="this.editFeature(feature)"
              (click)="this.editFeature(feature)"
              tabindex="0"
              class="cursor-pointer w-full group rounded-md"
            >
              <p
                class="font-medium group-focus:text-primary-500 group-focus:underline decoration-1 decoration-wavy underline-offset-2"
              >
                {{ feature.key }}
              </p>

              @if (feature.description) {
                <p class="text-gray-500 text-sm line-clamp-1">
                  {{ feature.description }}
                </p>
              }
            </div>
            @switch (feature.type) {
              @case (FeatureValueType.Boolean) {
                <div>
                  <ui-toggle
                    (click)="
                      $event.preventDefault(); this.toggleFeatureState(feature)
                    "
                    [checked]="feature.value"
                  ></ui-toggle>
                </div>
              }
              @case (FeatureValueType.Number) {
                <div>
                  <span class="p-1 bg-gray-100 rounded-xl">
                    {{ feature.value }}
                  </span>
                </div>
              }
              @default {
                <div>
                  <span class="p-1 bg-gray-100 rounded-xl">
                    "{{ feature.value }}"
                  </span>
                </div>
              }
            }
            <div>
              {{ feature.updatedAt | timeAgo }}
            </div>
            <div>
              <ui-dropdown
                [options]="this.menuOptions"
                (optionClick)="this.handleOptionClick($event, feature)"
              >
                <ui-button
                  variant="icon"
                  size="sm"
                  trailingIcon="more-fill"
                ></ui-button>
              </ui-dropdown>
            </div>
          </li>
        }
      </ul>
    } @else if (this.features && this.features.length === 0) {
      <div class="p-4">No features found.</div>
    }

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
    DropdownComponent,
    CheckboxComponent,
    AsyncPipe,
    ToggleComponent,
    ButtonComponent,
    TimeAgoPipe,
  ],
})
export class FeaturesListComponent {
  @Input()
  features?: Feature[] = [];

  @ViewChild('toggleFeatureValueTemplate', { static: true })
  public readonly toggleFeatureValueTemplate!: TemplateRef<{
    $implicit: Feature;
  }>;

  readonly activeEnvironment$ = inject(EnvironmentsService).activeEnvironment$;

  readonly menuOptions: DropdownOption[] = [
    {
      label: 'Edit',
      prefixIcon: 'pencil-line',
    },
    {
      label: 'Delete',
      variant: 'destructive',
      prefixIcon: 'delete-bin-6-line',
    },
  ];

  readonly sortByOptions: SelectOption<FeatureSortBy>[] = [
    {
      label: 'Key',
      value: FeatureSortBy.Key,
    },
    {
      label: 'Last Updated',
      value: FeatureSortBy.LastUpdated,
    },
  ];

  readonly selectedSortOptionSubject = new BehaviorSubject<FeatureSortBy>(
    this.sortByOptions[0].value,
  );

  protected readonly FeatureValueType = FeatureValueType;

  readonly #sheetService = inject(SheetService);
  readonly #featuresService = inject(FeatureService);
  readonly #modalService = inject(ModalService);
  readonly #toast = inject(HotToastService);

  public handleOptionClick(option: DropdownOption, feature: Feature): void {
    if (option.label === 'Edit') {
      this.editFeature(feature);
    } else if (option.label === 'Delete') {
      this.deleteFeature(feature);
    }
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

  public toggleFeatureState(feature: Feature): void {
    const isBooleanFeature = feature.type === FeatureValueType.Boolean;
    const title = isBooleanFeature
      ? `${feature.value ? 'Disable' : 'Enable'} feature?`
      : 'Edit Feature Value';
    const confirmButtonText = isBooleanFeature
      ? feature.value
        ? 'Disable'
        : 'Enable'
      : 'Confirm';

    this.#modalService
      .openConfirmation({
        title: title,
        content: this.toggleFeatureValueTemplate,
        context: { $implicit: feature },
        confirmButtonText: confirmButtonText,
        confirmButtonVariant: 'primary',
        cancelButtonText: 'Cancel',
        size: ModalSize.Small,
      })
      .pipe(
        filter((result) => result === true),
        withLatestFrom(this.activeEnvironment$),
        switchMap(([, activeEnvironment]) =>
          this.#featuresService.updateFeature(feature.id, {
            environmentOverrides: [
              {
                environmentId: activeEnvironment!.id,
                value: !feature.value,
              },
            ],
          }),
        ),
        this.#toast.observe({
          success: () => 'Feature flag updated successfully!',
          error: () => 'Failed to update feature flag!',
        }),
      )
      .subscribe();
  }

  public sortData(sortBy: FeatureSortBy): void {
    this.selectedSortOptionSubject.next(sortBy);
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

  protected readonly console = console;
}
