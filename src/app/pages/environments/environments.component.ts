import { AsyncPipe } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  Input,
  Signal,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EnvironmentsService } from '@app/services/environments/environments.service';
import { Environment } from '@app/types/environment.type';
import {
  ButtonComponent,
  FormFieldComponent,
  InputComponent,
  SheetService,
  TabChangeEvent,
  TabComponent,
  TabsComponent,
  TextareaComponent,
} from '@ui/components';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { isNil, lowerCase } from 'lodash-es';
import { SheetSize } from '../../../../projects/ui/src/lib/components/sheet/sheet.type';
import { AppRoutes } from '../../config/routes/app.routes';
import { EnvironmentSectionRoute } from '../../config/routes/environment.routes';
import { EnvironmentConfigSheetComponent } from '../../shared/components/environment-config-sheet/environment-config-sheet.component';
import { PageHeaderComponent } from '../../shared/components/header/page-header.component';

@Component({
  selector: 'app-environments',
  template: `
    <div class="flex flex-col h-full">
      <app-page-header title="Environments"></app-page-header>
      <section class="page-content grid grid-cols-[240px,1fr] p-0">
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
                [tabIndex]="
                  this.selectedEnvironment()?.id === environment.id ? -1 : 0
                "
                (keydown.enter)="this.selectEnvironment(environment)"
                (keydown.space)="this.selectEnvironment(environment)"
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
        <section>
          <header>
            <ui-tabs
              (tabChange)="this.updateSelectedTab($event)"
              [tabIndex]="this.selectedTabIndex()"
            >
              <ui-tab title="General" icon="settings-3-line">
                <div class="p-6 max-w-md">
                  <ui-form-field label="Name" errorMessage="Name is required.">
                    <ui-input></ui-input>
                  </ui-form-field>

                  <ui-form-field
                    label="Description"
                    errorMessage="Name is required."
                  >
                    <ui-textarea></ui-textarea>
                  </ui-form-field>

                  <footer class="flex justify-end">
                    <ui-button label="Update"></ui-button>
                  </footer>
                </div>
              </ui-tab>
              <ui-tab title="Access Keys" icon="key-2-line">
                <div class="p-6 max-w-md">
                  <ui-form-field
                    label="Access Key"
                    errorMessage="Name is required."
                  >
                    <div class="flex gap-2">
                      <ui-input class="flex-auto"></ui-input>
                      <ui-button prefixIcon="clipboard-line" label="Copy"
                        >Copy</ui-button
                      >
                    </div>
                  </ui-form-field>
                  <div>
                    <div class="text-sm text-gray-500">
                      Access key needs to be provided to the SDK to access the
                      flags for this environment.
                    </div>
                  </div>
                </div>
              </ui-tab>
              <ui-tab title="Webhooks" icon="terminal-box-line">
                Webhooks
              </ui-tab>
            </ui-tabs>
          </header>
        </section>
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
    TabsComponent,
    TabComponent,
    FormFieldComponent,
    TextareaComponent,
  ],
})
export class EnvironmentsComponent {
  @Input()
  set environmentId(environmentId: string) {
    this.selectedEnvironmentId.set(environmentId);
  }

  @Input()
  set section(section: EnvironmentSectionRoute) {
    console.log('section', section);
    this.activeSectionRoute.set(section ?? EnvironmentSectionRoute.General);
  }

  protected readonly environments: Signal<Environment[]>;
  protected readonly searchText = signal('');
  protected readonly selectedEnvironmentId = signal<string | undefined>(
    undefined,
  );
  protected readonly selectedEnvironment = computed(() => {
    return this.environments().find(
      (environment) => environment.id === this.selectedEnvironmentId(),
    );
  });

  protected readonly activeSectionRoute = signal<EnvironmentSectionRoute>(
    EnvironmentSectionRoute.General,
  );
  protected readonly selectedTabIndex = computed(() => {
    return !isNil(this.activeSectionRoute())
      ? Object.values(EnvironmentSectionRoute).indexOf(
          this.activeSectionRoute(),
        )
      : 0;
  });

  readonly #sheetService = inject(SheetService);
  readonly #environmentsService = inject(EnvironmentsService);
  readonly #router = inject(Router);

  constructor() {
    this.environments = computed(() => {
      return this.#environmentsService
        .environments()
        .filter((environment) =>
          lowerCase(environment.name).includes(lowerCase(this.searchText())),
        );
    });

    effect(
      () => {
        if (isNil(this.selectedEnvironment())) {
          this.selectEnvironment(this.#environmentsService.environments()[0]);
        }
      },
      {
        allowSignalWrites: true,
      },
    );
  }

  public search(searchText: string): void {
    this.searchText.set(searchText);
  }

  public openEnvironmentSheet(): void {
    this.#sheetService.open(EnvironmentConfigSheetComponent, {
      title: 'Create Environment',
      size: SheetSize.Medium,
    });
  }

  public selectEnvironment(environment: Environment): void {
    if (!isNil(environment)) {
      this.selectedEnvironmentId.set(environment.id);
      this.#router.navigate([
        '/',
        AppRoutes.Environments,
        environment.id,
        EnvironmentSectionRoute.General,
      ]);
    }
  }

  public updateSelectedTab(event: TabChangeEvent): void {
    const indexToRoutesMap: Record<number, string> = {
      0: EnvironmentSectionRoute.General,
      1: EnvironmentSectionRoute.AccessKeys,
      2: EnvironmentSectionRoute.Webhooks,
    };
    this.#router.navigate([
      '/',
      AppRoutes.Environments,
      this.selectedEnvironment()!.id,
      indexToRoutesMap[event.currIndex],
    ]);
  }
}

enum EnvironmentSection {
  General = 'General',
  AccessKeys = 'Access Keys',
  Webhooks = 'Webhooks',
}
