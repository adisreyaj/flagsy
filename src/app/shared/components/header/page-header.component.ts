import { Component, Input } from '@angular/core';

@Component({
  selector: `app-page-header`,
  template: `
    <header
      class="flex bg-white items-center justify-between gap-4 p-4 rounded-md"
    >
      <div class="font-bold text-2xl text-gray-800">
        {{ this.title }}
      </div>
      <div>
        <ng-content></ng-content>
      </div>
    </header>
  `,
  standalone: true,
})
export class PageHeaderComponent {
  @Input() public title = '';
}
