import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CELL_DATA } from './cell.type';

@Component({
  selector: 'ui-user-cell-template',
  template: `
    <div
      class="flex items-center  w-full h-full text-sm px-2 gap-x-2 text-ellipsis"
    >
      @if (this.cellData) {
        <img
          class="object-cover w-8 h-8 rounded-full"
          [src]="'https://avatar.tobi.sh/' + this.cellData.email"
          [alt]="this.cellData.firstName"
        />

        <div>
          <h1
            class="text-xs font-semibold text-gray-700 capitalize line-clamp-1"
          >
            {{ this.cellData.firstName }} {{ this.cellData.lastName }}
          </h1>

          <p class="text-xs text-gray-500 line-clamp-1">
            {{ this.cellData.email }}
          </p>
        </div>
      } @else {
        <p>-</p>
      }
    </div>
  `,
  styles: [
    `
      :host {
        width: 100%;
      }
    `,
  ],
  standalone: true,
  imports: [NgOptimizedImage],
})
export class UserCellTemplateComponent {
  protected cellData = inject<UserCellTemplateData | undefined>(CELL_DATA);
}

export interface UserCellTemplateData {
  firstName: string;
  lastName?: string;
  email?: string;
}
