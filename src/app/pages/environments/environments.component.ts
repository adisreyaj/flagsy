import { AsyncPipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  Signal,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { EnvironmentsService } from '@app/services/environments/environments.service';
import { Environment } from '@app/types/environment.type';
import { ButtonComponent, InputComponent, SheetService } from '@ui/components';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { isNil, lowerCase } from 'lodash-es';
import { SheetSize } from '../../../../projects/ui/src/lib/components/sheet/sheet.type';
import { EnvironmentConfigSheetComponent } from '../../shared/components/environment-config-sheet/environment-config-sheet.component';
import { PageHeaderComponent } from '../../shared/components/header/page-header.component';

@Component({
  selector: 'app-environments',
  template: `
    <div class="flex flex-col h-full">
      <app-page-header title="Environments"></app-page-header>
      <section class="page-content grid grid-cols-[240px,1fr] gap-4 p-0">
        <aside class="border-r p-4">
          <ul class="flex flex-col gap-4">
            <li>
              <ui-input
                type="text"
                class="w-full"
                prefixIcon="search-line"
                placeholder="Search"
                [debounceTime]="400"
                [ngModel]="this.searchText()"
                (ngModelChange)="this.search($event)"
              ></ui-input>
            </li>
            @for (environment of this.environments(); track environment.id) {
              <li
                class="item justify-between"
                [class.active]="
                  this.selectedEnvironment()?.id === environment.id
                "
                (click)="this.selectEnvironment(environment)"
              >
                <a>
                  {{ environment.name }}
                </a>
                @if (this.selectedEnvironment()?.id === environment.id) {
                  <rmx-icon
                    class="!w-5 !h-5 text-primary-500"
                    name="arrow-right-line"
                  ></rmx-icon>
                }
              </li>
            }
            <li>
              <ui-button
                size="sm"
                variant="primary"
                label="Create New"
                trailingIcon="add-line"
                (click)="this.openEnvironmentSheet()"
              ></ui-button>
            </li>
          </ul>
        </aside>
      </section>
    </div>
  `,
  styles: `
    .item {
      @apply cursor-pointer flex gap-2 items-center px-2 py-2 rounded-xl w-full relative transition-all duration-300;
      @apply focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none;
      @apply hover:bg-gray-100;
      
      min-height:40px;
      
      .icon {
        @apply h-5 w-5 flex-shrink-0;
      }
      
      &.active {
        @apply text-slate-800 bg-slate-100 font-semibold;
        
        .icon {
            @apply text-primary-600;
        }
      }
    }
  `,
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    PageHeaderComponent,
    ButtonComponent,
    InputComponent,
    AsyncPipe,
    AngularRemixIconComponent,
  ],
})
export class EnvironmentsComponent {
  protected readonly environments: Signal<Environment[]>;
  protected readonly searchText = signal('');
  protected readonly selectedEnvironment = signal<Environment | undefined>(
    undefined,
  );

  private readonly sheetService = inject(SheetService);
  private readonly environmentsService = inject(EnvironmentsService);

  constructor() {
    this.environments = computed(() => {
      return this.environmentsService
        .environments()
        .filter((environment) =>
          lowerCase(environment.name).includes(lowerCase(this.searchText())),
        );
    });

    effect(() => {
      if (isNil(this.selectedEnvironment())) {
        this.selectEnvironment(this.environmentsService.environments()[0]);
      }
    });
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

  public selectEnvironment(environment: Environment): void {
    this.selectedEnvironment.set(environment);
  }
}
