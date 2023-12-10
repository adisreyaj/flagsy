import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnvironmentsService } from '@app/services/environments/environments.service';
import { FeatureService } from '@app/services/features/feature.service';
import {
  Feature,
  FeatureSortBy,
  FeatureValueType,
} from '@app/types/feature.type';
import {
  ButtonComponent,
  CheckboxComponent,
  DropdownComponent,
  InputComponent,
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
  map,
  Observable,
  startWith,
  switchMap,
} from 'rxjs';
import { SheetSize } from '../../../../projects/ui/src/lib/components/sheet/sheet.type';
import {
  FeatureConfigSheetComponent,
  FeatureConfigSheetData,
  FeatureConfigSheetMode,
} from '../../shared/components/feature-config-sheet/feature-config-sheet.component';
import { PageHeaderComponent } from '../../shared/components/header/page-header.component';
import { ProjectEnvironmentSelectorComponent } from '../../shared/components/project-environment-selector/project-environment-selector.component';
import { SelectOption } from '../../shared/components/select.type';
import { NonNullPipe } from '../../shared/pipes/non-null.pipe';
import { FeaturesListComponent } from './features-list.component';

@Component({
  selector: 'app-features',
  template: `
    <div class="flex flex-col h-full">
      <app-page-header title="Features">
        <div class="flex gap-2 items-center">
          <app-project-environment-selector></app-project-environment-selector>
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
        <app-features-list
          [features]="this.features$ | async | nonNull"
        ></app-features-list>
      </section>
    </div>
  `,

  standalone: true,
  imports: [
    ButtonComponent,
    InputComponent,
    PageHeaderComponent,
    AsyncPipe,
    ToggleComponent,
    DropdownComponent,
    CheckboxComponent,
    SelectComponent,
    SelectOptionComponent,
    FormsModule,
    ReactiveFormsModule,
    FeaturesListComponent,
    NonNullPipe,
    ProjectEnvironmentSelectorComponent,
  ],
})
export class FeaturesComponent {
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

  readonly #sheetService = inject(SheetService);
  readonly #featuresService = inject(FeatureService);

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
}
