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
  ToggleComponent,
} from '@ui/components';

@Component({
  selector: 'app-feature-config-sheet',
  template: `
    <form [formGroup]="form" class="max-w-lg flex flex-col gap-6">
      <ui-toggle></ui-toggle>
      <div class="flex gap-2 items-center">
        <ui-form-field label="Key" errorMessage="Key is required." showError>
          <ui-input></ui-input>
        </ui-form-field>
        <ui-form-field label="Key" hint="A unique identifier name.">
          <ui-input></ui-input>
        </ui-form-field>
      </div>

      <footer class="flex items-center gap-3">
        <ui-input></ui-input>
        <ui-button label="Continue"></ui-button>
        <ui-button variant="neutral" label="Cancel"></ui-button>
      </footer>
    </form>
  `,
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ToggleComponent,
    ButtonComponent,
    InputComponent,
    FormFieldComponent,
  ],
})
export class FeatureConfigSheetComponent {
  protected readonly form: FormGroup<FeatureFormType>;
  private readonly fb: NonNullableFormBuilder = inject(FormBuilder).nonNullable;
  private readonly featureService = inject(FeatureService);
  protected readonly featureTypeSelectOptions =
    this.featureService.getFeatureTypeSelectOptions();

  constructor() {
    this.form = this.fb.group<FeatureFormType>({
      key: this.fb.control('', Validators.required),
      description: this.fb.control(''),
      valueType: this.fb.control(FeatureValueType.Boolean),
      value: this.fb.control(false),
    });
  }
}

interface FeatureFormType {
  key: FormControl<string>;
  description: FormControl<string>;
  valueType: FormControl<FeatureValueType>;
  value: FormControl<string | number | boolean>;
}
