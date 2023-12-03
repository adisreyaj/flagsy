import { AsyncPipe } from '@angular/common';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  InputComponent,
  ModalService,
  ModalSize,
  SelectComponent,
  SelectOptionComponent,
  SheetService,
  ToggleComponent,
} from '@ui/components';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  startWith,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { SheetSize } from '../../../../projects/ui/src/lib/components/sheet/sheet.type';
import { EnvironmentSelectorComponent } from '../../shared/components/environment-selector/environment-selector.component';
import {
  FeatureConfigSheetComponent,
  FeatureConfigSheetData,
  FeatureConfigSheetMode,
} from '../../shared/components/feature-config-sheet/feature-config-sheet.component';
import { PageHeaderComponent } from '../../shared/components/header/page-header.component';
import { SelectOption } from '../../shared/components/select.type';

@Component({
  selector: 'app-features',
  template: `
    <div class="flex flex-col h-full">
      <app-page-header title="Features">
        <div class="flex gap-2 items-center">
          <app-environment-selector></app-environment-selector>
          <ui-button
            label="Create Flag"
            trailingIcon="add-line"
            (click)="this.open()"
          ></ui-button>
        </div>
      </app-page-header>
      <section class="page-content flex flex-col gap-4">
        <header class="flex justify-between gap-4">
          <ui-input
            class="w-96 block"
            prefixIcon="search-line"
            placeholder="Search by key"
            [formControl]="this.searchControl"
          ></ui-input>

          <div></div>
        </header>
        <ul class="flex flex-col border rounded-xl">
          <li
            class="list-item px-4 py-2 border-b bg-gray-100 border-gray-200 rounded-tl-xl rounded-tr-xl"
          >
            <div class="flex items-center">
              <ui-checkbox></ui-checkbox>
            </div>
            <div>Key</div>
            <div>Value</div>
          </li>
          @for (
            feature of this.features$ | async;
            track feature.id;
            let index = $index
          ) {
            <li
              [tabindex]="index"
              class="list-item w-full justify-between items-center p-4"
            >
              <div class="flex items-center">
                <ui-checkbox></ui-checkbox>
              </div>
              <div
                (click)="this.editFeature(feature)"
                tabindex="0"
                class="cursor-pointer w-fit"
              >
                {{ feature.key }}
              </div>
              @switch (feature.type) {
                @case (FeatureValueType.Boolean) {
                  <div>
                    <ui-toggle
                      (click)="
                        $event.preventDefault();
                        this.toggleFeatureState(feature)
                      "
                      [enabled]="feature.value"
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
      </section>
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
      grid-template-columns: 20px 1fr 200px 34px;
      &:not(:last-child) {
        @apply border-b border-gray-200
      }
    }
  `,
  standalone: true,
  imports: [
    ButtonComponent,
    InputComponent,
    PageHeaderComponent,
    AsyncPipe,
    EnvironmentSelectorComponent,
    ToggleComponent,
    DropdownComponent,
    CheckboxComponent,
    SelectComponent,
    SelectOptionComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class FeaturesComponent {
  @ViewChild('toggleFeatureValueTemplate', { static: true })
  public readonly toggleFeatureValueTemplate!: TemplateRef<{
    $implicit: Feature;
  }>;

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

  readonly searchControl = new FormControl<string>('');

  readonly activeEnvironment$ = inject(EnvironmentsService).activeEnvironment$;
  readonly features$: Observable<Feature[]>;

  public readonly menuOptions: DropdownOption[] = [
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

  readonly #sheetService = inject(SheetService);
  readonly #featuresService = inject(FeatureService);
  readonly #modalService = inject(ModalService);
  readonly #toast = inject(HotToastService);

  constructor() {
    this.features$ = combineLatest([
      this.selectedSortOptionSubject,
      this.searchControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        startWith(''),
        map((val) => {
          return val?.trim();
        }),
      ),
    ]).pipe(
      switchMap(([sortBy, search]) =>
        this.#featuresService.getFeatures({
          sort: sortBy,
          search,
        }),
      ),
    );
  }

  public open(): void {
    this.#sheetService.open<FeatureConfigSheetData>(
      FeatureConfigSheetComponent,
      {
        title: 'Create Feature Flag',
        size: SheetSize.Large,
        data: {
          type: FeatureConfigSheetMode.Create,
        },
      },
    );
  }

  protected readonly FeatureValueType = FeatureValueType;

  public handleOptionClick(option: DropdownOption, feature: Feature): void {
    if (option.label === 'Edit') {
      this.editFeature(feature);
    } else if (option.label === 'Delete') {
      return; // TODO: Implement
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
}
