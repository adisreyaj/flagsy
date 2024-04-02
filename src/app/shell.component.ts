import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProjectsService } from './services/projects/projects.service';
import { SidebarService } from './services/sidebar/sidebar.service';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-shell',
  template: `
    <div class="shell flex bg-slate-100 h-screen">
      <aside class="aside p-2 pr-0">
        <app-sidebar
          [class.sidebar-open]="this.isSidebarOpen()"
          class="block sidebar h-full transition-all duration-500"
        ></app-sidebar>
      </aside>
      <main
        class="content transition-all duration-500 flex-auto p-2 rounded-xl min-w-0"
      >
        <div class="h-full bg-white rounded-xl">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
      .shell {
        .sidebar {
          width: 84px;

          &.sidebar-open {
            width: 15rem;
          }
        }
      }
    `,
  ],
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
})
export class ShellComponent {
  readonly #sidebarService = inject(SidebarService);
  readonly #projectService = inject(ProjectsService);

  protected readonly isSidebarOpen = this.#sidebarService.isOpen;

  public constructor() {
    this.#projectService.init();
  }
}
