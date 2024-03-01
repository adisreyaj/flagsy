import { A11yModule } from '@angular/cdk/a11y';
import { AsyncPipe, JsonPipe, TitleCasePipe } from '@angular/common';
import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EnvironmentsService } from '@app/services/environments/environments.service';
import { FeatureService } from '@app/services/features/feature.service';
import { ProjectsService } from '@app/services/projects/projects.service';
import {
  Feature,
  FeatureCreateData,
  FeatureUpdateData,
  FeatureValueType,
} from '@app/types/feature.type';
import { HotToastService } from '@ngneat/hot-toast';
import {
  ButtonComponent,
  CheckboxComponent,
  FormFieldComponent,
  InputComponent,
  SelectComponent,
  SelectOptionComponent,
  SheetRef,
  TextareaComponent,
  ToggleComponent,
  TooltipDirective,
} from '@ui/components';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { Subject, switchMap, take, takeUntil } from 'rxjs';
import { SHEET_DATA } from '../../../../../projects/ui/src/lib/components/sheet/sheet.type';
import { FormUtil } from '../../../utils/form.util';
import { EnvironmentSelectorComponent } from '../environment-selector/environment-selector.component';

@Component({
  selector: 'app-feature-config-sheet',
  template: `
    <div class="flex flex-col h-full">
      <form
        [formGroup]="form"
        class="flex flex-col gap-4 p-6 min-h-0 overflow-y-auto flex-auto"
      >
        <ui-form-field
          class="w-96"
          label="Key"
          hint="Allowed characters: Alphanumeric, dashes & underscores)"
          errorMessage="Key is required."
          [showError]="this.hasErrors(this.form.controls.key)"
        >
          <ui-input
            cdkFocusInitial
            formControlName="key"
            placeholder="my-cool-feature"
          ></ui-input>
        </ui-form-field>

        <ui-form-field label="Description" class="w-96">
          <ui-textarea
            formControlName="description"
            placeholder="Meaningful description for the flag"
          ></ui-textarea>
        </ui-form-field>

        <ui-form-field label="Type">
          <ui-select
            class="block"
            style="width: 200px"
            formControlName="valueType"
          >
            @for (option of this.featureTypeSelectOptions; track option.value) {
              <ui-select-option
                [label]="option.label | titlecase"
                [value]="option.value"
              ></ui-select-option>
            }
          </ui-select>
        </ui-form-field>

        <div>
          @switch (this.form.controls.valueType.value) {
            @case (FeatureValueType.Boolean) {
              <ui-form-field label="Value">
                <ui-toggle formControlName="value"></ui-toggle>
              </ui-form-field>
            }
            @case (FeatureValueType.Number) {
              <ui-form-field class="block w-40" label="Value">
                <ui-input formControlName="value" type="number"></ui-input>
              </ui-form-field>
            }
            @default {
              <ui-form-field label="Value" class="w-96">
                <ui-input formControlName="value"></ui-input>
              </ui-form-field>
            }
          }
        </div>

        <!---- Environments Override ----->
        @if (this.isCreateMode()) {
          <section class="flex flex-col gap-2" formArrayName="overrides">
            <header>
              <div class="flex items-center gap-1">
                <div class="font-semibold text-sm text-gray-600">
                  Environment Overrides
                </div>
                <div
                  uiTooltip="Override value for other environments if needed"
                >
                  <rmx-icon
                    class="!w-5 !h-5 text-gray-500"
                    name="information-line"
                  ></rmx-icon>
                </div>
              </div>
            </header>
            <div>
              <ul class="flex flex-col border rounded-xl">
                <li
                  class="list-item px-4 py-2 bg-gray-100 border-gray-200 rounded-tl-xl rounded-tr-xl"
                >
                  <div>Override</div>
                  <div>Key</div>
                  <div>Value</div>
                </li>
                @for (
                  control of this.form.controls.overrides.controls;
                  track control;
                  let i = $index
                ) {
                  <li class="list-item items-center gap-4" [formGroupName]="i">
                    <div class="flex items-center">
                      <ui-checkbox
                        formControlName="overrideEnabled"
                      ></ui-checkbox>
                    </div>
                    <div class="w-64">
                      {{ control?.getRawValue()?.environment?.name }}
                    </div>
                    <div class="flex-auto">
                      @switch (this.form.controls.valueType.value) {
                        @case (FeatureValueType.Boolean) {
                          <ui-toggle formControlName="value"></ui-toggle>
                        }
                        @case (FeatureValueType.Number) {
                          <ui-input
                            class="block w-40"
                            formControlName="value"
                            type="number"
                          ></ui-input>
                        }
                        @default {
                          <ui-input formControlName="value"></ui-input>
                        }
                      }
                    </div>
                  </li>
                }
              </ul>
            </div>
          </section>
        }
      </form>

      <footer
        class="flex items-center gap-3 flex-none px-6 py-4 justify-end border-t"
      >
        <ui-button
          variant="neutral"
          label="Close"
          (click)="this.closeSheet()"
        ></ui-button>
        <ui-button label="Save" (click)="this.saveOrUpdate()"></ui-button>
      </footer>
    </div>
  `,
  styles: `
    .list-item {
      @apply grid gap-3 w-full justify-between items-center px-4 py-2;
      grid-template-columns: 80px 200px 1fr;
      &:not(:last-child) {
        @apply border-b border-gray-200
      }
    }
  `,
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ToggleComponent,
    ButtonComponent,
    InputComponent,
    FormFieldComponent,
    SelectComponent,
    SelectOptionComponent,
    TextareaComponent,
    TitleCasePipe,
    A11yModule,
    EnvironmentSelectorComponent,
    AsyncPipe,
    JsonPipe,
    CheckboxComponent,
    AngularRemixIconComponent,
    TooltipDirective,
  ],
})
export class FeatureConfigSheetComponent implements OnDestroy {
  protected readonly form: FormGroup<FeatureFormType>;
  protected readonly featureTypeSelectOptions;
  protected readonly FeatureValueType = FeatureValueType;
  protected readonly submitted = signal(false);
  protected readonly availableEnvironmentSelectOptions;
  protected readonly initialEnvironmentSelectOptions;
  protected readonly activeEnvironment;

  readonly #sheetRef = inject(SheetRef);
  readonly #fb: NonNullableFormBuilder = inject(FormBuilder).nonNullable;
  readonly #featuresService = inject(FeatureService);
  readonly #projectsService = inject(ProjectsService);
  readonly #sheetData = inject<FeatureConfigSheetData>(SHEET_DATA);
  readonly #toast = inject(HotToastService);
  readonly #environmentService = inject(EnvironmentsService);
  readonly #destroyed = new Subject<void>();

  constructor() {
    this.activeEnvironment = this.#environmentService.activeEnvironment;
    this.featureTypeSelectOptions =
      this.#featuresService.getFeatureTypeSelectOptions();

    this.initialEnvironmentSelectOptions =
      this.#environmentService.getEnvironmentSelectOptions();

    this.availableEnvironmentSelectOptions = computed(() => {
      const activeEnvironment = this.#environmentService.activeEnvironment();

      return this.#environmentService
        .getEnvironmentSelectOptions()()
        .filter((option) => {
          return option.value !== activeEnvironment?.id;
        });
    });

    this.form = this.#buildForm();

    if (this.#sheetData.type === FeatureConfigSheetMode.Edit) {
      this.form.patchValue({
        key: this.#sheetData.feature.key,
        description: this.#sheetData.feature.description,
        valueType: this.#sheetData.feature.type,
        value: this.#sheetData.feature.value,
      });
    }
  }

  public ngOnDestroy(): void {
    this.#destroyed.next();
    this.#destroyed.complete();
  }

  protected hasErrors(control: AbstractControl): boolean {
    return FormUtil.hasErrors(control, this.submitted());
  }

  protected isCreateMode(): boolean {
    return this.#sheetData.type === FeatureConfigSheetMode.Create;
  }

  protected closeSheet() {
    this.#sheetRef.close();
  }

  protected saveOrUpdate(): void {
    if (this.#sheetData.type === FeatureConfigSheetMode.Create) {
      this.#saveFlag();
    } else {
      this.#updateFlag(this.#sheetData.feature.id);
    }
  }

  #saveFlag(): void {
    this.submitted.set(true);
    const activeProject = this.#projectsService.activeProject();
    if (this.form.valid && activeProject) {
      const { key, value, valueType, description, overrides } =
        this.form.getRawValue();

      const environmentOverrides = overrides
        .filter((item) => item.overrideEnabled)
        .map((override) => ({
          environmentId: override.environment.id,
          value: override.value,
        }));
      const createFeatureData: FeatureCreateData = {
        key,
        value,
        description,
        valueType,
        projectId: activeProject.id,
        environmentOverrides,
      };

      this.#featuresService
        .createFeature(createFeatureData)
        .pipe(
          this.#toast.observe({
            loading: 'Saving...',
            success: () => 'Feature flag created successfully!',
            error: () => 'Failed to create feature flag!',
          }),
        )
        .subscribe({
          next: () => this.closeSheet(),
        });
    }
  }

  #updateFlag(id: string): void {
    this.submitted.set(true);
    const activeProject = this.#projectsService.activeProject();
    if (this.form.valid && activeProject) {
      const { key, value, valueType, description } = this.form.getRawValue();

      const createFeatureData = (
        activeEnvironmentId: string,
      ): FeatureUpdateData => ({
        key,
        valueType,
        description,
        projectId: activeProject.id,
        environmentOverrides: [
          {
            environmentId: activeEnvironmentId,
            value,
          },
        ],
      });

      this.#environmentService.activeEnvironment$
        .pipe(
          take(1),
          switchMap((environment) =>
            this.#featuresService.updateFeature(
              id,
              createFeatureData(environment.id),
            ),
          ),
          this.#toast.observe({
            loading: 'Updating...',
            success: () => 'Feature flag updated successfully!',
            error: () => 'Failed to update feature flag!',
          }),
        )
        .subscribe({
          next: () => this.closeSheet(),
        });
    }
  }

  #buildForm(): FormGroup<FeatureFormType> {
    const form = this.#fb.group<FeatureFormType>({
      key: this.#fb.control('', Validators.required),
      description: this.#fb.control(''),
      valueType: this.#fb.control(FeatureValueType.Boolean),
      value: this.#fb.control(false),
      overrides: this.#fb.array<FormGroup<FeatureFormOverrides>>([]),
    });

    const formOverrides = this.availableEnvironmentSelectOptions().map(
      (option) => {
        return this.#fb.group<FeatureFormOverrides>({
          overrideEnabled: this.#fb.control(false, Validators.required),
          environment: this.#fb.control(
            {
              value: {
                id: option.value,
                name: option.label,
              },
              disabled: true,
            },
            Validators.required,
          ),
          value: this.#fb.control(
            { value: false, disabled: true },
            Validators.required,
          ),
        });
      },
    );

    form.controls.value.valueChanges
      .pipe(takeUntil(this.#destroyed))
      .subscribe((value) => {
        // Update all non overridden environments
        form.controls.overrides.controls.forEach((control) => {
          if (!control.value.overrideEnabled) {
            control.controls.value.setValue(value);
          }
        });
      });

    formOverrides.forEach((control) => {
      return control.controls.overrideEnabled.valueChanges
        .pipe(takeUntil(this.#destroyed))
        .subscribe((override) => {
          if (override) {
            control.controls.value.enable();
          } else {
            control.controls.value.disable();
            control.controls.value.setValue(form.controls.value.value);
          }
        });
    });

    form.controls.overrides.controls.push(...formOverrides);
    return form;
  }
}

interface FeatureFormType {
  key: FormControl<string>;
  description: FormControl<string>;
  valueType: FormControl<FeatureValueType>;
  value: FormControl<string | number | boolean>;
  overrides: FormArray<FormGroup<FeatureFormOverrides>>;
}

interface FeatureFormOverrides {
  overrideEnabled: FormControl<boolean>;
  environment: FormControl<{
    id: string;
    name: string;
  }>;
  value: FormControl<string | number | boolean>;
}

export type FeatureConfigSheetData =
  | {
      type: FeatureConfigSheetMode.Create;
    }
  | {
      type: FeatureConfigSheetMode.Edit;
      feature: Feature;
    };

export enum FeatureConfigSheetMode {
  Create = 'CREATE',
  Edit = 'EDIT',
}
