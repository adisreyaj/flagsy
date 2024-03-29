import { animate, style, transition, trigger } from '@angular/animations';
import { SlicePipe } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import {
  IsActiveMatchOptions,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { AccessService } from '@app/services/access/access.service';
import { AuthService } from '@app/services/auth/auth.service';
import { SidebarService } from '@app/services/sidebar/sidebar.service';
import {
  ButtonComponent,
  DropdownMenuComponent,
  DropdownMenuOption,
  PopoverPosition,
  TooltipDirective,
} from '@ui/components';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { isEmpty } from 'lodash-es';
import { switchMap } from 'rxjs';
import {
  NAVIGATION_DATA,
  NavigationEntry,
} from '../../../config/navigation-definition.data';
import { AppRoutes } from '../../../config/routes/app.routes';
import { ProjectEnvironmentSelectorComponent } from '../project-environment-selector/project-environment-selector.component';
import { ProjectSelectorComponent } from '../project-selector/project-selector.component';

@Component({
  selector: 'app-sidebar',
  template: `
    <div class="group flex flex-col bg-white rounded-xl h-full relative">
      <button
        class="transform-gpu transition-all duration-300 group-hover:opacity-100 focus-visible:opacity-100 flex top-6 bg-primary-500 opacity-0 absolute -right-3 cursor-pointer rounded-full w-6 h-6 shadow-md hover:bg-primary-600 items-center justify-center text-white focus-visible-outline"
        (click)="this.toggleSidebar()"
        [class.rotate-180]="this.isSidebarOpen()"
        aria-label="Toggle Sidebar"
      >
        <rmx-icon class="!w-4 !h-4" name="arrow-right-s-line"></rmx-icon>
      </button>
      <header class="p-4 flex items-center h-[75px]">
        <a routerLink="/">
          @if (this.isSidebarOpen()) {
            <img
              @logoEnter
              src="/assets/images/logo-full.svg"
              class="h-10"
              alt="Logo"
            />
          } @else {
            <img
              @logoEnter
              src="/assets/images/logo.svg"
              class="h-10 w-full"
              alt="Logo"
            />
          }
        </a>
      </header>
      <section class="p-4 flex-auto">
        <ul class="flex flex-col gap-4">
          @for (item of this.navigationEntriesEnriched; track item.path) {
            <li
              [uiTooltip]="this.isSidebarOpen() ? undefined : item.title"
              uiTooltipPosition="${PopoverPosition.RightCentered}"
            >
              <a
                class="item focus-visible-outline"
                routerLinkActive="active"
                [routerLink]="item.route"
                [routerLinkActiveOptions]="item.routerLinkActiveOptions"
                [attr.aria-label]="item.title"
                ariaCurrentWhenActive="page"
                #router="routerLinkActive"
              >
                <rmx-icon
                  class="icon"
                  [name]="router.isActive ? item.activeIcon : item.icon"
                ></rmx-icon>
                @if (this.isSidebarOpen()) {
                  <div @fadeSlideInOut>{{ item.title }}</div>
                }
              </a>
            </li>
          }
        </ul>
      </section>
      <footer class="flex gap-4 flex-col p-2">
        @if (this.isSidebarOpen()) {
          <app-project-environment-selector
            @logoEnter
          ></app-project-environment-selector>
        }
        <hr />
        @if (this.currentLoggedInAccount(); as account) {
          <ui-dropdown-menu
            class="block w-full"
            [options]="this.menuOptions"
            (optionClick)="this.handleOptionClick($event)"
          >
            <button
              class="w-full flex cursor-pointer items-center gap-2 hover:bg-slate-100 rounded-xl p-2 focus-visible-outline"
              [class.justify-center]="!this.isSidebarOpen()"
            >
              <img
                @logoEnter
                class="w-10 h-10 rounded-full"
                src="https://avatar.tobi.sh/test"
                [alt]="account.firstName"
              />
              @if (this.isSidebarOpen()) {
                <div class="flex flex-col items-start" @logoEnter>
                  <p class="text-sm font-medium">{{ account.firstName }}</p>
                  <p class="text-xs">{{ account.email }}</p>
                </div>
              }
            </button>
          </ui-dropdown-menu>
        }
      </footer>
    </div>
  `,
  styles: `
    .item {
      @apply cursor-pointer flex gap-2 items-center px-4 py-2 rounded-xl w-full relative transition-all duration-300;
      @apply hover:bg-gray-100;
      min-height:40px;
      
      .icon {
        @apply h-5 w-5 flex-shrink-0;
      }
      
      &.active {
        @apply text-primary-600 bg-slate-100 font-semibold;
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
    ButtonComponent,
    DropdownMenuComponent,
    ProjectEnvironmentSelectorComponent,
    TooltipDirective,
  ],
  animations: [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-10px)' }),
        animate(
          '200ms 200ms ease-in',
          style({ opacity: 1, transform: 'translateX(0)' }),
        ),
      ]),
      transition(':leave', [
        animate(
          '100ms ease-out',
          style({ opacity: 0, transform: 'translateX(-10px)' }),
        ),
      ]),
    ]),
    trigger('logoEnter', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-10px)' }),
        animate(
          '700ms 100ms ease-in-out',
          style({ opacity: 1, transform: 'translateX(0px)' }),
        ),
      ]),
    ]),
  ],
})
export class SidebarComponent {
  protected readonly navigationEntriesEnriched: NavigationEntryEnriched[];
  protected readonly routerLinkActiveOptions: IsActiveMatchOptions = {
    paths: 'subset',
    fragment: 'ignored',
    queryParams: 'ignored',
    matrixParams: 'subset',
  };
  protected readonly menuOptions: DropdownMenuOption[] = [
    {
      label: 'My Profile',
      prefixIcon: 'user-3-line',
    },
    {
      label: 'Logout',
      variant: 'destructive',
      prefixIcon: 'logout-circle-line',
    },
  ];

  protected readonly currentLoggedInAccount = inject(AuthService).account;
  readonly #sidebarService = inject(SidebarService);
  protected isSidebarOpen: Signal<boolean> = this.#sidebarService.isOpen;
  readonly #router = inject(Router);
  readonly #authService = inject(AuthService);
  readonly #accessService = inject(AccessService);

  public constructor() {
    this.navigationEntriesEnriched = NAVIGATION_DATA.map((item) => {
      return {
        ...item,
        route: ['/', ...(!isEmpty(item.path) ? [item.path] : [])],
        featureEnabled: this.#accessService.hasAccess(item.featureFlags),
        routerLinkActiveOptions: {
          exact: item.path === AppRoutes.Home,
        },
      };
    }).filter((item) => item.featureEnabled);
  }

  protected toggleSidebar(): void {
    this.#sidebarService.toggleSidebar();
  }

  protected handleOptionClick(event: DropdownMenuOption) {
    if (event.label === this.menuOptions[0].label) {
      return this.#router.navigate([AppRoutes.Profile]);
    }
    if (event.label === this.menuOptions[1].label) {
      return this.#authService
        .logout()
        .pipe(switchMap(() => this.#router.navigate([AppRoutes.Login])))
        .subscribe(() => {});
    }
    return;
  }
}

interface NavigationEntryEnriched extends NavigationEntry {
  featureEnabled: boolean;
  route: string[];
  routerLinkActiveOptions: IsActiveMatchOptions | { exact: boolean };
}
