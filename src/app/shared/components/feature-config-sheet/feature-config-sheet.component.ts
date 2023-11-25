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
import { FeatureService } from '@app/services/features/feature.service';
import { ProjectsService } from '@app/services/projects/projects.service';
import { FeatureCreateData, FeatureValueType } from '@app/types/feature.type';
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
              <ui-form-field label="Enabled">
                <ui-toggle></ui-toggle>
              </ui-form-field>
            }
            @case (FeatureValueType.Number) {
              <ui-form-field label="Value">
                <ui-input type="number"></ui-input>
              </ui-form-field>
            }
            @default {
              <ui-form-field label="Value">
                <ui-input></ui-input>
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
        <ui-button label="Save Flag" (click)="this.saveFlag()"></ui-button>
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

  private readonly sheetRef = inject(SheetRef);
  private readonly fb: NonNullableFormBuilder = inject(FormBuilder).nonNullable;
  private readonly featuresService = inject(FeatureService);
  private readonly projectsService = inject(ProjectsService);

  constructor() {
    this.featureTypeSelectOptions =
      this.featuresService.getFeatureTypeSelectOptions();
    this.form = this.fb.group<FeatureFormType>({
      key: this.fb.control('', Validators.required),
      description: this.fb.control(''),
      valueType: this.fb.control(FeatureValueType.Boolean),
      value: this.fb.control(false),
    });
  }

  hasErrors(control: AbstractControl): boolean {
    return FormUtil.hasErrors(control, this.submitted());
  }

  closeSheet() {
    this.sheetRef.close();
  }

  saveFlag(): void {
    this.submitted.set(true);
    const activeProject = this.projectsService.activeProject();
    if (this.form.valid && activeProject) {
      const { key, value, valueType, description } = this.form.getRawValue();
      const createFeatureData: FeatureCreateData = {
        key,
        environmentOverrides: [],
        value,
        valueType,
        projectId: activeProject.id,
      };

      this.featuresService.createFeature(createFeatureData).subscribe();
    }
  }
}

interface FeatureFormType {
  key: FormControl<string>;
  description: FormControl<string>;
  valueType: FormControl<FeatureValueType>;
  value: FormControl<string | number | boolean>;
}
