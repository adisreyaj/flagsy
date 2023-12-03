import { A11yModule } from '@angular/cdk/a11y';
import { TitleCasePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
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
  FormFieldComponent,
  InputComponent,
  SelectComponent,
  SelectOptionComponent,
  SheetRef,
  TextareaComponent,
  ToggleComponent,
} from '@ui/components';
import { switchMap, take } from 'rxjs';
import { SHEET_DATA } from '../../../../../projects/ui/src/lib/components/sheet/sheet.type';
import { FormUtil } from '../../../utils/form.util';

@Component({
  selector: 'app-feature-config-sheet',
  template: `
    <div class="flex flex-col h-full">
      <form
        [formGroup]="form"
        class="flex flex-col gap-4 p-6 min-h-0 overflow-y-auto flex-auto max-w-lg"
      >
        <ui-form-field
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

        <ui-form-field label="Description">
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
              <ui-form-field label="Value">
                <ui-input formControlName="value" type="number"></ui-input>
              </ui-form-field>
            }
            @default {
              <ui-form-field label="Value">
                <ui-input formControlName="value"></ui-input>
              </ui-form-field>
            }
          }
        </div>
      </form>

      <footer class="flex items-center gap-3 flex-none px-6 py-4 justify-end ">
        <ui-button
          variant="neutral"
          label="Close"
          (click)="this.closeSheet()"
        ></ui-button>
        <ui-button label="Save" (click)="this.saveOrUpdate()"></ui-button>
      </footer>
    </div>
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
  ],
})
export class FeatureConfigSheetComponent {
  protected readonly form: FormGroup<FeatureFormType>;
  protected readonly featureTypeSelectOptions;
  protected readonly FeatureValueType = FeatureValueType;
  protected readonly submitted = signal(false);

  readonly #sheetRef = inject(SheetRef);
  readonly #fb: NonNullableFormBuilder = inject(FormBuilder).nonNullable;
  readonly #featuresService = inject(FeatureService);
  readonly #projectsService = inject(ProjectsService);
  readonly #sheetData = inject<FeatureConfigSheetData>(SHEET_DATA);
  readonly #toast = inject(HotToastService);
  readonly #environmentService = inject(EnvironmentsService);

  constructor() {
    this.featureTypeSelectOptions =
      this.#featuresService.getFeatureTypeSelectOptions();
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

  hasErrors(control: AbstractControl): boolean {
    return FormUtil.hasErrors(control, this.submitted());
  }

  closeSheet() {
    this.#sheetRef.close();
  }

  saveOrUpdate(): void {
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
      const { key, value, valueType, description } = this.form.getRawValue();
      const createFeatureData: FeatureCreateData = {
        key,
        value,
        description,
        valueType,
        projectId: activeProject.id,
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
    return this.#fb.group<FeatureFormType>({
      key: this.#fb.control('', Validators.required),
      description: this.#fb.control(''),
      valueType: this.#fb.control(FeatureValueType.Boolean),
      value: this.#fb.control(false),
    });
  }
}

interface FeatureFormType {
  key: FormControl<string>;
  description: FormControl<string>;
  valueType: FormControl<FeatureValueType>;
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
