import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ButtonComponent,
  CommandPaletteComponent,
  CommandPaletteGroupComponent,
  CommandPaletteListItem,
  CommandPaletteSeparatorComponent,
} from '@ui/components';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { AppRoutes } from '../../../config/routes/app.routes';

@Component({
  selector: 'app-cmd-palette',
  template: `
    <div>
      <ui-cmd-palette class="col gap-4">
        <ui-cmd-palette-group label="Browse">
          <div class="flex flex-col gap-2">
            <a
              routerLink="/${AppRoutes.Projects}"
              uiCmdPaletteListItem
              class="item group"
            >
              <div class="flex gap-2 items-center">
                <rmx-icon class="icon-sm" name="briefcase-line"></rmx-icon>
                <p>Projects</p>
              </div>
              <div
                class="visit hidden items-center group-hover:flex group-focus-visible:flex transition-opacity"
              >
                <p class="text-xs">Visit</p>
                <rmx-icon name="arrow-right-up-line" class="icon-xs"></rmx-icon>
              </div>
            </a>
            <a
              routerLink="/${AppRoutes.Environments}"
              uiCmdPaletteListItem
              class="item group"
            >
              <div class="flex gap-2 items-center">
                <rmx-icon class="icon-sm" name="archive-drawer-line"></rmx-icon>
                <p>Environments</p>
              </div>
              <div
                class="visit hidden items-center group-hover:flex group-focus-visible:flex"
              >
                <p class="text-xs">Visit</p>
                <rmx-icon name="arrow-right-up-line" class="icon-xs"></rmx-icon>
              </div>
            </a>
            <a
              routerLink="/${AppRoutes.Features}"
              uiCmdPaletteListItem
              class="item group"
            >
              <div class="flex gap-2 items-center">
                <rmx-icon class="icon-sm" name="flag-line"></rmx-icon>
                <p>Features</p>
              </div>
              <div
                class="visit hidden items-center group-hover:flex group-focus-visible:flex"
              >
                <p class="text-xs">Visit</p>
                <rmx-icon name="arrow-right-up-line" class="icon-xs"></rmx-icon>
              </div>
            </a>
            <a
              routerLink="/${AppRoutes.Changelog}"
              uiCmdPaletteListItem
              class="item group"
            >
              <div class="flex gap-2 items-center">
                <rmx-icon class="icon-sm" name="lock-line"></rmx-icon>
                <p>Changelog</p>
              </div>
              <div
                class="visit hidden items-center group-hover:flex group-focus-visible:flex"
              >
                <p class="text-xs">Visit</p>
                <rmx-icon name="arrow-right-up-line" class="icon-xs"></rmx-icon>
              </div>
            </a>
          </div>
        </ui-cmd-palette-group>
        <ui-cmd-palette-separator></ui-cmd-palette-separator>
      </ui-cmd-palette>
    </div>
  `,
  standalone: true,
  styles: [
    // language=scss
    `
      .item {
        @apply flex gap-2 items-center justify-between rounded-xl px-3 py-2;

        &:focus-visible,
        &:hover {
          @apply bg-slate-100;
          .visit {
            @apply text-primary-500;
          }
        }
      }
    `,
  ],
  imports: [
    ButtonComponent,
    CommandPaletteComponent,
    CommandPaletteGroupComponent,
    CommandPaletteListItem,
    CommandPaletteSeparatorComponent,
    AngularRemixIconComponent,
    RouterLink,
  ],
})
export class FlagsyCommandPaletteComponent {}
