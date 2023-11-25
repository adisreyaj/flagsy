import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FeatureService } from '@app/services/features/feature.service';
import { Feature } from '@app/types/feature.type';
import { ButtonComponent, InputComponent, SheetService } from '@ui/components';
import { Observable } from 'rxjs';
import { SheetSize } from '../../../../projects/ui/src/lib/components/sheet/sheet.type';
import { FeatureConfigSheetComponent } from '../../shared/components/feature-config-sheet/feature-config-sheet.component';
import { PageHeaderComponent } from '../../shared/components/header/page-header.component';

@Component({
  selector: 'app-features',
  template: `
    <div class="flex flex-col h-full">
      <app-page-header title="Features">
        <div class="flex gap-2 items-center">
          <ui-input
            type="text"
            class="w-64"
            prefixIcon="search-line"
            placeholder="Search"
            [debounceTime]="400"
          ></ui-input>
          <ui-button
            label="Create Flag"
            trailingIcon="add-line"
            (click)="this.open()"
          ></ui-button>
        </div>
      </app-page-header>
      <section class="page-content">
        <ul class="flex gap-4">
          @for (feature of this.features$ | async; track feature.id) {
            <li
              class="flex p-4 rounded-md border border-gray-300 cursor-pointer"
            >
              {{ feature.key }}
            </li>
          }
        </ul>
      </section>
    </div>
  `,
  standalone: true,
  imports: [ButtonComponent, InputComponent, PageHeaderComponent, AsyncPipe],
})
export class FeaturesComponent {
  public readonly features$: Observable<Feature[]>;
  readonly #sheetService = inject(SheetService);
  readonly #featuresService = inject(FeatureService);

  constructor() {
    this.features$ = this.#featuresService.getFeatures();
  }

  public open(): void {
    this.#sheetService.open(FeatureConfigSheetComponent, {
      title: 'Create Feature Flag',
      size: SheetSize.Large,
    });
  }
}
