import { Component } from '@angular/core';
import { FeatureConfigSheetComponent } from '../../shared/components/feature-config-sheet/feature-config-sheet.component';

@Component({
  selector: 'app-features',
  template: ` <div>
    <app-feature-config-sheet></app-feature-config-sheet>
  </div>`,
  standalone: true,
  imports: [FeatureConfigSheetComponent],
})
export class FeaturesComponent {}
