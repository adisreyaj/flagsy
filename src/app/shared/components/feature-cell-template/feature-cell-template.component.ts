import { Component, inject } from '@angular/core';
import { Feature, FeatureValueType } from '@app/types/feature.type';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { IconName } from 'angular-remix-icon/lib/icon-names';
import { ROW_DATA } from '../../../../../projects/ui/src/lib/components/table/cell-templates/cell.type';
import { TextDisplayPipe } from '../../../../../projects/ui/src/lib/pipes/text-display.pipe';

@Component({
  selector: `app-feature-cell-template`,
  template: `
    <div class="flex gap-1 items-center w-full h-full px-2">
      <div
        class="h-full flex items-center p-1 justify-center"
        [class.rotate-180]="this.isValueBooleanPositive"
        [class.text-green-600]="this.isValueBooleanPositive"
        [class.text-red-500]="this.isValueBooleanNegative"
      >
        <rmx-icon class="!w-4 !h-4" [name]="this.iconName"></rmx-icon>
      </div>
      <div class="flex items-center text-sm text-ellipsis">
        <div class="line-clamp-1 min-w-0">
          {{ this.rowData.value | textDisplay }}
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [TextDisplayPipe, AngularRemixIconComponent],
})
export class FeatureCellTemplateComponent {
  protected rowData = inject<Feature>(ROW_DATA);
  protected iconName: IconName;

  protected isValueBooleanPositive = this.rowData.value === true;
  protected isValueBooleanNegative = this.rowData.value === false;

  constructor() {
    this.iconName = this.getIconName(this.rowData.type);
  }

  private getIconName(type: FeatureValueType): IconName {
    switch (type) {
      case FeatureValueType.Boolean:
        return 'toggle-line';
      case FeatureValueType.Number:
        return 'hashtag';
      default:
        return 'text';
    }
  }
}
