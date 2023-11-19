import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarService } from './services/sidebar/sidebar.service';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-shell',
  template: `
    <div
      class="shell flex bg-slate-100 h-screen"
      [class.sidebar-open]="this.isSidebarOpen()"
    >
      <aside class="sidebar p-2 pr-0">
        <app-sidebar></app-sidebar>
      </aside>
      <main class="content flex-auto p-2">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .shell {
        &.sidebar-open {
          .sidebar {
            width: 16rem;
          }
        }
      }
    `,
  ],
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
})
export class ShellComponent {
  private readonly sidebarService = inject(SidebarService);

  protected readonly isSidebarOpen = this.sidebarService.isOpen;
}
