import { Component, contentChildren, input } from '@angular/core';
import { CommandPaletteListItem } from './command-palette-list-item.directive';

let groupId = 0;

@Component({
  selector: 'ui-cmd-palette-group',
  template: `<div class="col gap-4">
    <header>
      <h3 class="text-sm font-medium text-gray-600">{{ this.label() }}</h3>
    </header>
    <div>
      <ng-content />
    </div>
  </div>`,
  standalone: true,
})
export class CommandPaletteGroupComponent {
  public label = input.required<string>();
  public items = contentChildren(CommandPaletteListItem);
  public readonly groupId = `cmd-palette-group-${groupId++}`;
}
