import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private isSidebarOpen = signal(true);
  public readonly isOpen = this.isSidebarOpen.asReadonly();

  toggleSidebar() {
    this.isSidebarOpen.set(!this.isSidebarOpen());
  }
}
