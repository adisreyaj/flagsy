import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FeatureService } from '@app/services/features/feature.service';
import { FeatureValueType } from '@app/types/feature';
import {
  ButtonComponent,
  FormFieldComponent,
  InputComponent,
  SelectComponent,
  SelectOptionComponent,
  SheetRef,
  ToggleComponent,
} from '@ui/components';

@Component({
  selector: 'app-feature-config-sheet',
  template: `
    <div class="flex flex-col h-full">
      <form
        [formGroup]="form"
        class="flex flex-col gap-4 p-6 min-h-0 overflow-y-auto flex-auto"
      >
        <ui-form-field label="Key" errorMessage="Key is required." showError>
          <ui-input formControlName="key"></ui-input>
        </ui-form-field>
        <ui-form-field label="Description">
          <ui-input formControlName="description"></ui-input>
        </ui-form-field>
        <ui-form-field label="Key" errorMessage="Key is required." showError>
          <ui-input formControlName="key"></ui-input>
        </ui-form-field>
        <ui-form-field label="Description">
          <ui-input formControlName="description"></ui-input>
        </ui-form-field>

        <ui-form-field label="Key" errorMessage="Key is required." showError>
          <ui-input formControlName="key"></ui-input>
        </ui-form-field>
        <ui-form-field label="Description">
          <ui-input formControlName="description"></ui-input>
        </ui-form-field>

        <ui-form-field label="Key" errorMessage="Key is required." showError>
          <ui-input formControlName="key"></ui-input>
        </ui-form-field>
        <ui-form-field label="Description">
          <ui-input formControlName="description"></ui-input>
        </ui-form-field>

        <ui-form-field label="Type">
          <ui-select
            class="block"
            style="width: 200px"
            formControlName="valueType"
          >
            @for (option of this.featureTypeSelectOptions; track option.value) {
              <ui-select-option
                [label]="option.label"
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
            @default {
              <ui-form-field label="Value">
                <ui-input></ui-input>
              </ui-form-field>
            }
          }
        </div>
      </form>
      <footer
        class="flex items-center gap-3 flex-none px-6 py-4 justify-end border-t border-gray-200"
      >
        <ui-button
          variant="neutral"
          label="Close"
          (click)="this.closeSheet()"
        ></ui-button>
        <ui-button label="Continue"></ui-button>
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
  ],
})
export class FeatureConfigSheetComponent {
  protected readonly form: FormGroup<FeatureFormType>;
  protected readonly featureTypeSelectOptions;
  protected readonly FeatureValueType = FeatureValueType;

  private readonly sheetRef = inject(SheetRef);
  private readonly fb: NonNullableFormBuilder = inject(FormBuilder).nonNullable;
  private readonly featureService = inject(FeatureService);

  constructor() {
    this.featureTypeSelectOptions =
      this.featureService.getFeatureTypeSelectOptions();
    this.form = this.fb.group<FeatureFormType>({
      key: this.fb.control('', Validators.required),
      description: this.fb.control(''),
      valueType: this.fb.control(FeatureValueType.Boolean),
      value: this.fb.control(false),
    });
  }

  closeSheet() {
    this.sheetRef.close();
  }
}

interface FeatureFormType {
  key: FormControl<string>;
  description: FormControl<string>;
  valueType: FormControl<FeatureValueType>;
  value: FormControl<string | number | boolean>;
}
