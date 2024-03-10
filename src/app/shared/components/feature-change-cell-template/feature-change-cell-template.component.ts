import { Component, inject } from '@angular/core';
import {
  FeatureChangelog,
  FeatureChangelogChangeData,
  FeatureChangeLogType,
} from '@app/types/changelog.type';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import {
  CELL_DATA,
  ROW_DATA,
} from '../../../../../projects/ui/src/lib/components/table/cell-templates/cell.type';

@Component({
  selector: 'app-feature-change-cell-template',
  template: ` <div class="flex items-center gap-1 text-sm h-full px-2">
    @switch (this.type) {
      @case ('${FeatureChangeLogType.ValueChange}') {
        <div class="flex items-center gap-1 text-sm h-full">
          @if (this.cellData?.old?.value !== undefined) {
            <div class="bg-red-50 py-1 px-2 rounded-md text-red-700">
              {{ this.cellData!.old.value }}
            </div>
          }
          <div>
            <rmx-icon class="!w-4 !h-4" name="arrow-right-s-line"></rmx-icon>
          </div>
          @if (this.cellData?.new?.value !== undefined) {
            <div class="bg-green-50 py-1 px-2 rounded-md text-green-700">
              {{ this.cellData!.new.value }}
            </div>
          }
        </div>
      }
      @case ('${FeatureChangeLogType.Create}') {
        <div class="bg-green-50 py-1 px-2 rounded-md text-green-700">
          Created
        </div>
      }
      @case ('${FeatureChangeLogType.Delete}') {
        <div class="bg-red-50 py-1 px-2 rounded-md text-red-700">Deleted</div>
      }
    }
  </div>`,
  standalone: true,
  imports: [AngularRemixIconComponent],
})
export class FeatureChangeCellTemplateComponent {
  protected cellData = inject<FeatureChangelogChangeData | undefined>(
    CELL_DATA,
  );
  protected type = inject<FeatureChangelog>(ROW_DATA)?.type;
}
