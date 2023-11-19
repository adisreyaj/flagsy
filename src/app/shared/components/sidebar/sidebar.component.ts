import { SlicePipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  IsActiveMatchOptions,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { NAVIGATION_DATA } from '../../../config/navigation-definition.data';
import { ProjectSelectorComponent } from '../project-selector/project-selector.component';

@Component({
  selector: 'app-sidebar',
  template: `
    <div class="flex flex-col bg-white rounded-md h-full">
      <header class="p-4 flex justify-start items-center h-[75px]">
        <img src="/assets/images/logo-full.svg" class="h-10" alt="Logo" />
      </header>
      <ul class="flex flex-col gap-4 p-4">
        <app-project-selector></app-project-selector>
        <li>
          <a
            class="item"
            [routerLink]="['/']"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            ariaCurrentWhenActive="page"
            #router="routerLinkActive"
          >
            <rmx-icon
              class="icon"
              [name]="router.isActive ? 'home-2-fill' : 'home-2-line'"
            ></rmx-icon>
            <div>Home</div>
          </a>
        </li>
        @for (item of NAVIGATION_ITEMS; track item.id) {
          <li>
            <a
              class="item"
              [routerLink]="item.route"
              routerLinkActive="active"
              [routerLinkActiveOptions]="routerLinkActiveOptions"
              ariaCurrentWhenActive="page"
              #router="routerLinkActive"
            >
              <rmx-icon
                class="icon"
                [name]="router.isActive ? item.activeIcon : item.icon"
              ></rmx-icon>
              <div>{{ item.title }}</div>
            </a>
          </li>
        }
      </ul>
    </div>
  `,
  styles: `
    .item {
      @apply cursor-pointer flex gap-2 items-center px-4 py-2 rounded-md w-full relative;
      
      .icon {
        @apply h-5 w-5;
      }
      
      &.active {
        @apply text-slate-800 bg-slate-100 font-semibold;
        
        .icon {
            @apply text-primary-600;
        }
      }
    }
  `,
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    SlicePipe,
    ProjectSelectorComponent,
    AngularRemixIconComponent,
  ],
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
