import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarService } from './services/sidebar/sidebar.service';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-shell',
  template: `
    <div class="shell" [class.sidebar-open]="this.isSidebarOpen()">
      <aside class="sidebar">
        <app-sidebar></app-sidebar>
      </aside>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .shell {
        display: flex;

        .content {
          flex: 1 1 auto;
        }

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
