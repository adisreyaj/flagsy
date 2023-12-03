import { animate, style, transition, trigger } from '@angular/animations';
import { SlicePipe } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import {
  IsActiveMatchOptions,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { SidebarService } from '@app/services/sidebar/sidebar.service';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { NAVIGATION_DATA } from '../../../config/navigation-definition.data';
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
      <section class="p-4">
        <div style="height: 64px">
          @if (this.isSidebarOpen()) {
            <app-project-selector @logoEnter></app-project-selector>
          }
        </div>
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

  private readonly sidebarService = inject(SidebarService);

  protected isSidebarOpen: Signal<boolean> = this.sidebarService.isOpen;

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }
}
