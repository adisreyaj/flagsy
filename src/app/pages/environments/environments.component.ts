import { Component, inject, Signal, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs';
import { AppRoutes } from '../../config/routes/app.routes';
import { EnvironmentsService } from '../../services/environments/environments.service';
import { Environment } from '../../types/environment.type';

@Component({
  selector: 'app-environments',
  template: `
    <div class="flex flex-col gap-4">
      <header>
        <input
          type="text"
          placeholder="Search"
          [ngModel]="this.searchText()"
          (ngModelChange)="this.searchText.set($event)"
          class="border border-gray-400 rounded-lg px-4 py-2"
        />
      </header>
      <section>
        <ul class="flex gap-4">
          @for (environment of environments();track environment.id) {
          <li class="flex p-4 rounded-md border border-gray-300 cursor-pointer">
            <a [routerLink]="environment.route">
              {{ environment.name }}
            </a>
          </li>
          }
        </ul>
      </section>
    </div>
  `,
  standalone: true,
  imports: [FormsModule, RouterLink],
})
export class EnvironmentsComponent {
  protected readonly environments: Signal<EnvironmentWithRoute[]>;
  protected readonly searchText = signal('');

  private readonly environmentsService = inject(EnvironmentsService);

  constructor() {
    this.environments = toSignal(
      toObservable(this.searchText).pipe(
        debounceTime(300),
        map((searchText) => searchText.trim()),
        map((searchText) => searchText.toLowerCase()),
        distinctUntilChanged(),
        switchMap((searchText) =>
          this.environmentsService.getEnvironments({ searchText }),
        ),
        map((environments) =>
          environments.map((environment) => ({
            ...environment,
            route: ['/', AppRoutes.Environments, environment.id],
          })),
        ),
      ),
      {
        initialValue: [],
      },
    );
  }
}

interface EnvironmentWithRoute extends Environment {
  route: string[];
}
