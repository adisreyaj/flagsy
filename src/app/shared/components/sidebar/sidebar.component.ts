import { SlicePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  IsActiveMatchOptions,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { NAVIGATION_DATA } from '../../../config/navigation-definition.data';

@Component({
  selector: 'app-sidebar',
  template: `
    <div>
      <ul>
        <li class="cursor-pointer">
          <a
            [routerLink]="['/']"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            ariaCurrentWhenActive="page"
          >
            Home
          </a>
        </li>
        @for (item of NAVIGATION_ITEMS; track item.id) {
          <li class="cursor-pointer">
            <a
              [routerLink]="item.route"
              routerLinkActive="active"
              [routerLinkActiveOptions]="routerLinkActiveOptions"
              ariaCurrentWhenActive="page"
            >
              {{ item.title }}
            </a>
          </li>
        }
      </ul>
    </div>
  `,
  styles: `
    .active {
      @apply text-primary-500;
    }
  `,
  standalone: true,
  imports: [RouterLink, RouterLinkActive, SlicePipe],
})
export class SidebarComponent {
  protected readonly NAVIGATION_ITEMS = NAVIGATION_DATA;
  protected readonly routerLinkActiveOptions: IsActiveMatchOptions = {
    paths: 'subset',
    fragment: 'ignored',
    queryParams: 'ignored',
    matrixParams: 'subset',
  };
}
