import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private isSidebarOpen = signal(true);
  public readonly isOpen = computed(() => this.isSidebarOpen());

  toggleSidebar() {
    this.isSidebarOpen.set(!this.isSidebarOpen());
  }
}
