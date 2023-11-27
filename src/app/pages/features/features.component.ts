import { AsyncPipe } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { FeatureService } from '@app/services/features/feature.service';
import { Feature, FeatureValueType } from '@app/types/feature.type';
import {
  ButtonComponent,
  InputComponent,
  SheetService,
  ToggleComponent,
} from '@ui/components';
import { SheetSize } from '../../../../projects/ui/src/lib/components/sheet/sheet.type';
import { EnvironmentSelectorComponent } from '../../shared/components/environment-selector/environment-selector.component';
import {
  FeatureConfigSheetComponent,
  FeatureConfigSheetData,
  FeatureConfigSheetMode,
} from '../../shared/components/feature-config-sheet/feature-config-sheet.component';
import { PageHeaderComponent } from '../../shared/components/header/page-header.component';

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
      <section class="page-content">
        <ul class="flex flex-col gap-4">
          @for (feature of this.features(); track feature.id) {
            <li
              (click)="this.openFlagConfigSheet(feature)"
              class="flex w-full justify-between items-center p-4 rounded-md border border-gray-300 cursor-pointer"
            >
              <div>
                {{ feature.key }}
              </div>
              @switch (feature.type) {
                @case (FeatureValueType.Boolean) {
                  <div>
                    <ui-toggle [enabled]="feature.value"></ui-toggle>
                  </div>
                }
                @default {
                  <div>
                    {{ feature.value }}
                  </div>
                }
              }
            </li>
          }
        </ul>
      </section>
    </div>
  `,
  standalone: true,
  imports: [
    ButtonComponent,
    InputComponent,
    PageHeaderComponent,
    AsyncPipe,
    EnvironmentSelectorComponent,
    ToggleComponent,
  ],
})
export class FeaturesComponent {
  public readonly features: Signal<Feature[]>;
  readonly #sheetService = inject(SheetService);
  readonly #featuresService = inject(FeatureService);

  constructor() {
    this.features = this.#featuresService.getFeatures();
  }

  public open(): void {
    this.#sheetService.open(FeatureConfigSheetComponent, {
      title: 'Create Feature Flag',
      size: SheetSize.Large,
    });
  }

  protected readonly FeatureValueType = FeatureValueType;

  public openFlagConfigSheet(feature: Feature): void {
    this.#sheetService.open<
      FeatureConfigSheetComponent,
      FeatureConfigSheetData
    >(FeatureConfigSheetComponent, {
      title: 'Edit Feature Flag',
      size: SheetSize.Large,
      data: {
        type: FeatureConfigSheetMode.Edit,
        feature,
      },
    });
  }
}
