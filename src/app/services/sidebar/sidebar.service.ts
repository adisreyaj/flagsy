import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private isSidebarOpen = signal(true);
  public readonly isOpen = this.isSidebarOpen.asReadonly();

  private readonly SIDEBAR_OPEN_KEY: string = 'sidebar-open';

  constructor() {
    this.isSidebarOpen.set(
      localStorage.getItem(this.SIDEBAR_OPEN_KEY) === 'true',
    );
  }

  toggleSidebar() {
    this.isSidebarOpen.set(!this.isSidebarOpen());
    localStorage.setItem(this.SIDEBAR_OPEN_KEY, `${this.isSidebarOpen()}`);
  }
}
