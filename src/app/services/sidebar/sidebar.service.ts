import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  #isSidebarOpen = signal(true);
  public readonly isOpen = this.#isSidebarOpen.asReadonly();

  readonly #SIDEBAR_OPEN_PREFERENCE_KEY: string = 'sidebar-open';

  public constructor() {
    this.#isSidebarOpen.set(
      localStorage.getItem(this.#SIDEBAR_OPEN_PREFERENCE_KEY) === 'true',
    );
  }

  public toggleSidebar() {
    this.#isSidebarOpen.set(!this.#isSidebarOpen());
    localStorage.setItem(
      this.#SIDEBAR_OPEN_PREFERENCE_KEY,
      `${this.#isSidebarOpen()}`,
    );
  }
}
