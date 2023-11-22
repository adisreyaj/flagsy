import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-checkbox',
  template: ` <div class="text-sm font-normal">
    <label [for]="this.label" class="flex items-center gap-2 cursor-pointer">
      <input [id]="this.label" type="checkbox" class="h-5 w-5" />
      <div>
        {{ this.label }}
      </div>
    </label>
  </div>`,
  standalone: true,
})
export class CheckboxComponent {
  @Input()
  label: string = '';
}
