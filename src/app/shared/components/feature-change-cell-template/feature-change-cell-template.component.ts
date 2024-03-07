import { Component, inject } from '@angular/core';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { CellData } from '../../../../../projects/ui/src/lib/components/table/cell-templates/cell.type';

@Component({
  selector: 'app-feature-change-cell-template',
  template: ` <div class="flex items-center gap-1 text-sm h-full px-2">
    <div class="bg-red-50 py-1 px-2 rounded-md text-red-700">
      {{ cellData.old.value }}
    </div>
    <div>
      <rmx-icon class="!w-4 !h-4" name="arrow-right-s-line"></rmx-icon>
    </div>
    <div class="bg-green-50 py-1 px-2 rounded-md text-green-700">
      {{ cellData.new.value }}
    </div>
  </div>`,
  standalone: true,
  imports: [AngularRemixIconComponent],
})
export class FeatureChangeCellTemplateComponent {
  protected cellData = inject<FeatureChangeCellTemplateData>(CellData);
}

export interface FeatureChangeCellTemplateData {
  old: {
    value: string;
  };
  new: {
    value: string;
  };
}
