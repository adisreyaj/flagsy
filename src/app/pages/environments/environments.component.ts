import { FocusKeyManager } from '@angular/cdk/a11y';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  Input,
  Signal,
  signal,
  viewChildren,
} from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { EnvironmentsService } from '@app/services/environments/environments.service';
import { Environment } from '@app/types/environment.type';
import { FocusableDirective } from '@ui/a11y';
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
import { FeatureFlag } from '../../config/feature.config';
import { AppRoutes } from '../../config/routes/app.routes';
import { EnvironmentSectionRoute } from '../../config/routes/environment.routes';
import { EnvironmentConfigSheetComponent } from '../../shared/components/environment-config-sheet/environment-config-sheet.component';
import { PageHeaderComponent } from '../../shared/components/header/page-header.component';
import { FfAccessDirective } from '../../shared/directives/ff-access.directive';
import { HasFFAccessPipe } from '../../shared/pipes/has-ff-access.pipe';

@Component({
  selector: 'app-environments',
  template: `
    <div class="flex flex-col h-full">
      <app-page-header title="Environments"></app-page-header>
      <section class="page-content grid grid-cols-[250px,1fr] p-0">
        <aside class="border-r p-4 flex flex-col gap-4">
          <header>
            <ui-input
              type="text"
              class="w-full"
              prefixIcon="search-line"
              placeholder="Search"
              [debounceTime]="400"
              [ngModel]="this.searchText()"
              (ngModelChange)="this.search($event)"
            ></ui-input>
          </header>
          <ul class="flex flex-col gap-4" (keydown)="this.onKeydown($event)">
            @for (
              environment of this.environments();
              track environment.id;
              let index = $index
            ) {
              <li
                focusable
                [attr.tabindex]="
                  this.selectedEnvironment()?.id === environment.id ? 0 : -1
                "
                class="item justify-between"
                [class.active]="
                  this.selectedEnvironment()?.id === environment.id
                "
                (keydown.enter)="this.selectEnvironment(environment)"
                (keydown.space)="this.selectEnvironment(environment)"
                (focus)="this.keyManager().updateActiveItem(index)"
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
          </ul>
          <footer>
            <ui-button
              size="sm"
              variant="primary"
              label="Create New"
              trailingIcon="add-line"
              (click)="this.openEnvironmentSheet()"
            ></ui-button>
          </footer>
        </aside>
        <section>
          <header>
            <ui-tabs
              (tabChange)="this.updateSelectedTab($event)"
              [tabIndex]="this.selectedTabIndex()"
            >
              <ui-tab title="General" icon="settings-3-line">
                <div class="p-6 max-w-md" [formGroup]="this.detailForm">
                  <ui-form-field label="Name" errorMessage="Name is required.">
                    <ui-input formControlName="name"></ui-input>
                  </ui-form-field>

                  <ui-form-field
                    label="Description"
                    errorMessage="Name is required."
                  >
                    <ui-textarea formControlName="description"></ui-textarea>
                  </ui-form-field>

                  <footer class="flex justify-end">
                    <ui-button
                      label="Update"
                      (click)="
                        this.updateEnvironment(this.selectedEnvironmentId())
                      "
                    ></ui-button>
                  </footer>
                </div>
              </ui-tab>
              <ui-tab
                *ffAccess="'${FeatureFlag.EnvironmentKeys}'"
                title="Keys"
                icon="key-2-line"
              >
                <div class="p-6 max-w-md flex flex-col gap-8">
                  <section>
                    <ui-form-field label="Environment Key">
                      <div class="flex gap-2">
                        <ui-input
                          class="flex-auto"
                          [ngModel]="this.selectedEnvironmentId()"
                          disabled
                        ></ui-input>
                        <ui-button prefixIcon="clipboard-line"></ui-button>
                      </div>
                    </ui-form-field>
                    <div class="text-sm text-gray-500">
                      Environment key is the unique identifier of the
                      environment.
                    </div>
                  </section>

                  <section>
                    <ui-form-field
                      label="Access Key"
                      errorMessage="Name is required."
                    >
                      <div class="flex gap-2">
                        <ui-input class="flex-auto"></ui-input>
                        <ui-button prefixIcon="clipboard-line"> </ui-button>
                      </div>
                    </ui-form-field>
                    <div class="text-sm text-gray-500">
                      Access key needs to be provided to the SDK to access the
                      flags for this environment.
                    </div>
                  </section>
                </div>
              </ui-tab>
              <ui-tab
                *ffAccess="'${FeatureFlag.Webhooks}'"
                title="Webhooks"
                icon="terminal-box-line"
              >
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
      @apply focus-visible:ring-2 ring-primary-500 ring-offset-2 focus-visible:outline-none;
      @apply hover:bg-gray-100;
      
      min-height:40px;
      
      .icon {
        @apply h-5 w-5 flex-shrink-0;
      }
      
      &.active {
        @apply text-primary-600 bg-slate-100 font-medium;
        
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
    FocusableDirective,
    ReactiveFormsModule,
    NgIf,
    HasFFAccessPipe,
    FfAccessDirective,
  ],
})
export class EnvironmentsComponent {
  environmentListItems: Signal<ReadonlyArray<FocusableDirective>> =
    viewChildren(FocusableDirective);

  @Input()
  set environmentId(environmentId: string) {
    this.selectedEnvironmentId.set(environmentId);
  }

  @Input()
  set section(section: EnvironmentSectionRoute) {
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

  protected readonly detailForm;

  keyManager = computed(() => {
    return new FocusKeyManager(
      this.environmentListItems() as FocusableDirective[],
    ).withWrap(true);
  });

  readonly #sheetService = inject(SheetService);
  readonly #environmentsService = inject(EnvironmentsService);
  readonly #router = inject(Router);
  readonly #fb = inject(NonNullableFormBuilder);

  constructor() {
    this.environments = computed(() => {
      return this.#environmentsService
        .environments()
        .filter((environment) =>
          lowerCase(environment.name).includes(lowerCase(this.searchText())),
        );
    });

    this.detailForm = this.#fb.group({
      name: ['', Validators.required],
      description: [''],
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

    effect(
      () => {
        const selectedEnvironment = this.selectedEnvironment();
        if (!isNil(selectedEnvironment)) {
          this.detailForm.patchValue({
            name: selectedEnvironment.name,
            description: '',
          });
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

  public selectEnvironment(environment: Environment) {
    if (!isNil(environment)) {
      this.selectedEnvironmentId.set(environment.id);
      return this.#router.navigate([
        '/',
        AppRoutes.Environments,
        environment.id,
        EnvironmentSectionRoute.General,
      ]);
    }
    return;
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

  onKeydown(event: KeyboardEvent) {
    this.keyManager()?.onKeydown(event);
  }

  public updateEnvironment(id?: string): void {
    if (!isNil(id)) {
      this.#environmentsService
        .updateEnvironment({
          id,
          name: this.detailForm.controls.name.value,
        })
        .subscribe();
    }
  }
}
