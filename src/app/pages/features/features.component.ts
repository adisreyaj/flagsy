import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeatureSortBy, FeatureValueType } from '@app/types/feature.type';
import {
  ButtonComponent,
  CheckboxComponent,
  DropdownMenuComponent,
  InputComponent,
  SelectComponent,
  SelectOptionComponent,
  SheetService,
  ToggleComponent,
} from '@ui/components';
import { BehaviorSubject } from 'rxjs';
import { SheetSize } from '../../../../projects/ui/src/lib/components/sheet/sheet.type';
import {
  FeatureConfigSheetComponent,
  FeatureConfigSheetData,
  FeatureConfigSheetMode,
} from '../../shared/components/feature-config-sheet/feature-config-sheet.component';
import { PageHeaderComponent } from '../../shared/components/header/page-header.component';
import { SelectOption } from '../../shared/components/select.type';
import { NonNullPipe } from '../../shared/pipes/non-null.pipe';
import { FeaturesListComponent } from './features-list.component';

@Component({
  selector: 'app-features',
  template: `
    <div class="flex flex-col h-full">
      <app-page-header>
        <div class="flex gap-2 items-center">
          <ui-button
            label="Create Flag"
            trailingIcon="add-line"
            (click)="this.openCreateFeatureSheet()"
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
        <app-features-list></app-features-list>
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
    DropdownMenuComponent,
    CheckboxComponent,
    SelectComponent,
    SelectOptionComponent,
    FormsModule,
    ReactiveFormsModule,
    FeaturesListComponent,
    NonNullPipe,
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
  readonly #sheetService = inject(SheetService);

  constructor() {}

  public openCreateFeatureSheet(): void {
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
