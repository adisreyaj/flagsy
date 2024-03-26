import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { SheetSize } from '../../../../projects/ui/src/lib/components/sheet/sheet.type';
import { Permissions } from '../../config/permission.config';
import {
  FeatureConfigSheetComponent,
  FeatureConfigSheetData,
  FeatureConfigSheetMode,
} from '../../shared/components/feature-config-sheet/feature-config-sheet.component';
import { PageHeaderComponent } from '../../shared/components/header/page-header.component';
import { PermissionAccessDirective } from '../../shared/directives/persmission-access.directive';
import { NonNullPipe } from '../../shared/pipes/non-null.pipe';
import { FeaturesListComponent } from './features-list.component';

@Component({
  selector: 'app-features',
  template: `
    <div class="flex flex-col h-full">
      <app-page-header>
        <div class="flex gap-2 items-center">
          <ui-button
            *permissionAccess="this.featuresWriteScope"
            label="Create Flag"
            trailingIcon="add-line"
            (click)="this.openCreateFeatureSheet()"
          ></ui-button>
        </div>
      </app-page-header>
      <section class="page-content">
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
    PermissionAccessDirective,
  ],
})
export class FeaturesComponent {
  readonly #sheetService = inject(SheetService);
  public featuresWriteScope = Permissions.feature.write;

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
}
