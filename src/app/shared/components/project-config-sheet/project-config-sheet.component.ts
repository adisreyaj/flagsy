import { A11yModule } from '@angular/cdk/a11y';
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
import { ProjectsService } from '@app/services/projects/projects.service';
import {
  ButtonComponent,
  FormFieldComponent,
  InputComponent,
  SheetRef,
} from '@ui/components';
import { ValidatorsUtil } from '../../../utils/validators.util';

@Component({
  selector: 'app-project-config-sheet',
  template: ` <div class="flex flex-col h-full" cdkTrapFocusAutoCapture>
    <form
      [formGroup]="form"
      class="flex flex-col gap-4 p-6 min-h-0 overflow-y-auto flex-auto max-w-lg"
    >
      <ui-form-field
        label="Name"
        errorMessage="Enter a valid name."
        [showError]="this.hasErrors(this.form.controls.name)"
      >
        <ui-input cdkFocusInitial formControlName="name"></ui-input>
      </ui-form-field>

      <ui-form-field
        label="Key"
        errorMessage="Enter a valid key."
        hint="Unique identifier for the project."
        [showError]="this.hasErrors(this.form.controls.key)"
      >
        <ui-input formControlName="key"></ui-input>
      </ui-form-field>
    </form>
    <footer class="flex items-center gap-3 flex-none px-6 py-4 justify-end">
      <ui-button
        variant="neutral"
        label="Close"
        (click)="this.closeSheet()"
      ></ui-button>
      <ui-button
        label="Create Project"
        (click)="this.saveProject()"
      ></ui-button>
    </footer>
  </div>`,
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FormFieldComponent,
    InputComponent,
    ButtonComponent,
    A11yModule,
  ],
})
export class ProjectConfigSheetComponent {
  protected readonly form: FormGroup<ProjectFormType>;
  protected readonly submitted = signal(false);

  readonly #sheetRef = inject(SheetRef);
  readonly #projectsService = inject(ProjectsService);
  readonly #fb: NonNullableFormBuilder = inject(FormBuilder).nonNullable;

  public constructor() {
    this.form = this.#buildForm();
  }

  protected hasErrors(control: AbstractControl): boolean {
    if (this.submitted()) {
      return control.invalid;
    }

    return (control.touched || control.dirty) && control.invalid;
  }

  protected closeSheet() {
    this.#sheetRef.close();
  }

  protected saveProject(): void {
    this.submitted.set(true);
    if (this.form.valid) {
      this.#projectsService
        .createProject({
          name: this.form.controls.name.value,
          key: this.form.controls.key.value,
        })
        .subscribe({
          next: () => {
            this.closeSheet();
          },
        });
    }
  }

  #buildForm(): FormGroup<ProjectFormType> {
    const form = this.#fb.group<ProjectFormType>({
      name: this.#fb.control('', Validators.required),
      key: this.#fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(ValidatorsUtil.ALPHANUMERIC_WITH_DASHES),
      ]),
    });

    form.controls.name.valueChanges.subscribe((value) => {
      form.controls.key.setValue(value.toLowerCase().replaceAll(/\s/g, '-'));
    });

    return form;
  }
}

interface ProjectFormType {
  key: FormControl<string>;
  name: FormControl<string>;
}
