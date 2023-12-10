import { animate, style, transition, trigger } from '@angular/animations';
import { SlicePipe } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import {
  IsActiveMatchOptions,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { AuthService } from '@app/services/auth/auth.service';
import { SidebarService } from '@app/services/sidebar/sidebar.service';
import {
  ButtonComponent,
  DropdownComponent,
  DropdownOption,
} from '@ui/components';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { switchMap } from 'rxjs';
import { NAVIGATION_DATA } from '../../../config/navigation-definition.data';
import { AppRoutes } from '../../../config/routes/app.routes';
import { ProjectSelectorComponent } from '../project-selector/project-selector.component';

@Component({
  selector: 'app-sidebar',
  template: `
    <div class="group flex flex-col bg-white rounded-xl h-full relative">
      <button
        class="transform-gpu transition-all duration-300 group-hover:opacity-100 focus:opacity-100 flex top-6 bg-primary-500 opacity-0 absolute -right-3 cursor-pointer rounded-full w-6 h-6 shadow-md hover:bg-primary-600 items-center justify-center text-white focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none"
        (click)="this.toggleSidebar()"
        [class.rotate-180]="this.isSidebarOpen()"
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
              @if (this.isSidebarOpen()) {
                <div @fadeSlideInOut>Home</div>
              }
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
                @if (this.isSidebarOpen()) {
                  <div @fadeSlideInOut>{{ item.title }}</div>
                }
              </a>
            </li>
          }
        </ul>
      </section>
      <footer class="p-2">
        @if (this.currentLoggedInAccount(); as account) {
          <ui-dropdown
            class="block w-full"
            [options]="this.menuOptions"
            (optionClick)="this.handleOptionClick($event)"
          >
            <div
              class="w-full flex cursor-pointer items-center gap-2 hover:bg-slate-100 rounded-xl p-2"
              [class.justify-center]="!this.isSidebarOpen()"
            >
              <img
                @logoEnter
                class="w-10 h-10 rounded-full"
                src="https://avatar.tobi.sh/test"
                [alt]="account.firstName"
              />
              @if (this.isSidebarOpen()) {
                <div @logoEnter>
                  <p class="text-sm font-medium">{{ account.firstName }}</p>
                  <p class="text-xs">{{ account.email }}</p>
                </div>
              }
            </div>
          </ui-dropdown>
        }
      </footer>
    </div>
  `,
  styles: `
    .item {
      @apply cursor-pointer flex gap-2 items-center px-4 py-2 rounded-xl w-full relative transition-all duration-300;
      @apply focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none;
      min-height:40px;
      
      .icon {
        @apply h-5 w-5 flex-shrink-0;
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
    ButtonComponent,
    DropdownComponent,
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
  protected readonly NAVIGATION_ITEMS = NAVIGATION_DATA;
  protected readonly routerLinkActiveOptions: IsActiveMatchOptions = {
    paths: 'subset',
    fragment: 'ignored',
    queryParams: 'ignored',
    matrixParams: 'subset',
  };

  protected readonly menuOptions: DropdownOption[] = [
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

  private readonly sidebarService = inject(SidebarService);
  protected readonly currentLoggedInAccount = inject(AuthService).account;
  protected isSidebarOpen: Signal<boolean> = this.sidebarService.isOpen;

  readonly #router = inject(Router);
  readonly #authService = inject(AuthService);

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  public handleOptionClick(event: DropdownOption) {
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
