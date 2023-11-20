import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EnvironmentsService } from '@app/services/environments/environments.service';
import { Environment } from '@app/types/environment.type';
import { ButtonComponent, InputComponent, SheetService } from '@ui/components';
import { lowerCase } from 'lodash-es';
import { map, Observable } from 'rxjs';
import { SheetSize } from '../../../../projects/ui/src/lib/components/sheet/sheet.type';
import { AppRoutes } from '../../config/routes/app.routes';
import { EnvironmentConfigSheetComponent } from '../../shared/components/environment-config-sheet/environment-config-sheet.component';
import { PageHeaderComponent } from '../../shared/components/header/page-header.component';

@Component({
  selector: 'app-environments',
  template: `
    <div class="flex flex-col h-full">
      <app-page-header title="Environments">
        <div class="flex gap-2 items-center">
          <ui-input
            type="text"
            class="w-64"
            prefixIcon="search-line"
            placeholder="Search"
            [debounceTime]="400"
            [ngModel]="this.searchText()"
            (ngModelChange)="this.search($event)"
          ></ui-input>
          <ui-button
            label="Create"
            trailingIcon="add-line"
            (click)="this.openEnvironmentSheet()"
          ></ui-button>
        </div>
      </app-page-header>
      <section class="page-content">
        <ul class="flex gap-4">
          @for (environment of environments | async; track environment.id) {
            <li
              class="flex p-4 rounded-md border border-gray-300 cursor-pointer"
            >
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
  imports: [
    FormsModule,
    RouterLink,
    PageHeaderComponent,
    ButtonComponent,
    InputComponent,
    AsyncPipe,
  ],
})
export class EnvironmentsComponent {
  protected readonly environments: Observable<EnvironmentWithRoute[]>;
  protected readonly searchText = signal('');

  private readonly sheetService = inject(SheetService);
  private readonly environmentsService = inject(EnvironmentsService);

  constructor() {
    this.environments = this.environmentsService.getAllEnvironments().pipe(
      map((environments) => {
        return environments.filter((environment) =>
          lowerCase(environment.name).includes(lowerCase(this.searchText())),
        );
      }),
      map((environments) => {
        return environments.map((environment) => ({
          ...environment,
          route: ['/', AppRoutes.Environments, environment.id],
        }));
      }),
    );
  }

  public search(searchText: string): void {
    this.searchText.set(searchText);
  }

  public openEnvironmentSheet(): void {
    this.sheetService.open(EnvironmentConfigSheetComponent, {
      title: 'Create Environment',
      size: SheetSize.Medium,
    });
  }
}

interface EnvironmentWithRoute extends Environment {
  route: string[];
}
