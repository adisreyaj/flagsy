import { Component, inject } from '@angular/core';
import { ButtonComponent, InputComponent, SheetService } from '@ui/components';
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
      <section class="page-content"></section>
    </div>
  `,
  standalone: true,
  imports: [ButtonComponent, InputComponent, PageHeaderComponent],
})
export class FeaturesComponent {
  protected readonly sheetService = inject(SheetService);

  public open(): void {
    this.sheetService.open(FeatureConfigSheetComponent, {
      title: 'Create Feature Flag',
      size: SheetSize.Large,
    });
  }
}
