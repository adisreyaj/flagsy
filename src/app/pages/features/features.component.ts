import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnvironmentsService } from '@app/services/environments/environments.service';
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
import { AngularRemixIconComponent } from 'angular-remix-icon';
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
    <div class="flex flex-col h-full ">
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
      <!-- @if (this.activeEnvironment(); as environment) {
        <div class="text-center text-sm flex justify-center bg-green-600 h-5">
          <div
            class="px-2 py-1 rounded-t-lg  text-xs text-white flex items-center gap-1"
          >
            <rmx-icon name="archive-drawer-line" class="!w-4 !h-4"></rmx-icon>
            <div>
              {{ environment.name }}
            </div>
          </div>
        </div>
      } @else {
        <div class="h-5"></div>
      }-->
      <section class="page-content relative w-full">
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
    AngularRemixIconComponent,
  ],
})
export class FeaturesComponent {
  protected featuresWriteScope = Permissions.feature.write;

  readonly #sheetService = inject(SheetService);
  readonly #environmentService = inject(EnvironmentsService);

  protected activeEnvironment = this.#environmentService.activeEnvironment;

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
