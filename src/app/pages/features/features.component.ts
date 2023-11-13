import { Component, inject } from '@angular/core';
import { SheetService } from '@ui/components';
import { SheetSize } from '../../../../projects/ui/src/lib/components/sheet/sheet.type';
import { FeatureConfigSheetComponent } from '../../shared/components/feature-config-sheet/feature-config-sheet.component';

@Component({
  selector: 'app-features',
  template: ` <div>
    <button (click)="this.open()">Open Sheet</button>
  </div>`,
  standalone: true,
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
