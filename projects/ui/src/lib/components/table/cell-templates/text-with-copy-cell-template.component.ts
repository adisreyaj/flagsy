import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { Component, inject } from '@angular/core';
import { TextDisplayPipe } from '../../../pipes/text-display.pipe';
import { ButtonComponent } from '../../button/button.component';
import { TooltipDirective } from '../../tooltip';
import { CELL_DATA } from './cell.type';

@Component({
  selector: 'ui-text-with-copy-cell-template',
  template: `
    <div
      class="flex items-center justify-between w-full h-full text-sm group px-2"
    >
      <div class="line-clamp-1 min-w-0">
        {{ this.cellData | textDisplay }}
      </div>

      <ui-button
        uiTooltip="Copy"
        class="hidden group-hover:block aspect-square text-gray-600"
        variant="plain"
        size="xs"
        prefixIcon="clipboard-line"
        [cdkCopyToClipboard]="this.cellData"
      >
      </ui-button>
    </div>
  `,
  standalone: true,
  styles: [
    `
      :host {
        width: 100%;
      }
    `,
  ],
  imports: [
    TextDisplayPipe,
    ButtonComponent,
    TooltipDirective,
    CdkCopyToClipboard,
  ],
})
export class TextWithCopyCellTemplateComponent {
  protected cellData = inject<string>(CELL_DATA);
}
