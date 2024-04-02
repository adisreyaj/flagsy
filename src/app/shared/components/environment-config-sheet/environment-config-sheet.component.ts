import { A11yModule } from '@angular/cdk/a11y';
import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EnvironmentsService } from '@app/services/environments/environments.service';
import { ProjectsService } from '@app/services/projects/projects.service';
import { Project } from '@app/types/project.type';
import {
  ButtonComponent,
  FormFieldComponent,
  InputComponent,
  SelectComponent,
  SelectOptionComponent,
  SheetRef,
} from '@ui/components';
import { isNil } from 'lodash-es';
import { filter, switchMap } from 'rxjs';
import { ValidatorsUtil } from '../../../utils/validators.util';

@Component({
  selector: 'app-environment-config-sheet',
  template: ` <div class="flex flex-col h-full">
    <form
      [formGroup]="form"
      class="flex flex-col gap-4 p-6 min-h-0 overflow-y-auto flex-auto max-w-lg"
    >
      <ui-form-field
        label="Name"
        errorMessage="Name is required."
        [showError]="this.hasErrors(this.form.controls.name)"
      >
        <ui-input
          cdkFocusInitial
          formControlName="name"
          placeholder="Eg: staging"
        ></ui-input>
      </ui-form-field>

      <ui-form-field
        label="Key"
        errorMessage="key is required."
        [showError]="this.hasErrors(this.form.controls.key)"
      >
        <ui-input cdkFocusInitial formControlName="key"></ui-input>
      </ui-form-field>
    </form>
    <footer class="flex items-center gap-3 flex-none px-6 py-4 justify-end">
      <ui-button
        variant="neutral"
        label="Close"
        (click)="this.closeSheet()"
      ></ui-button>
      <ui-button
        label="Create Environment"
        (click)="this.saveEnvironment()"
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
    SelectComponent,
    AsyncPipe,
    SelectOptionComponent,
    A11yModule,
  ],
})
export class EnvironmentConfigSheetComponent {
  protected readonly form: FormGroup<EnvironmentFormType>;
  protected readonly submitted = signal(false);

  readonly #environmentService = inject(EnvironmentsService);
  readonly #projectsService = inject(ProjectsService);
  readonly #sheetRef = inject(SheetRef);
  readonly #fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

  public constructor() {
    this.form = this.#buildForm();
  }

  protected hasErrors(control: AbstractControl): boolean {
    return (
      this.submitted() && (control.touched || control.dirty) && control.invalid
    );
  }

  protected closeSheet() {
    this.#sheetRef.close();
  }

  protected saveEnvironment(): void {
    this.#projectsService.activeProject$
      .pipe(
        filter((project): project is Project => !isNil(project)),
        switchMap((project) => {
          return this.#environmentService.createEnvironment({
            name: this.form.controls.name.value,
            key: this.form.controls.key.value,
            projectId: project.id,
          });
        }),
      )
      .subscribe({
        next: () => {
          this.closeSheet();
        },
      });
  }

  #buildForm(): FormGroup<EnvironmentFormType> {
    const form = this.#fb.group<EnvironmentFormType>({
      name: this.#fb.control('', Validators.required),
      key: this.#fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(ValidatorsUtil.ALPHANUMERIC_WITH_DASHES),
      ]),
      projectId: this.#fb.control('', Validators.required),
    });
    form.controls.name.valueChanges.subscribe((value) => {
      form.controls.key.setValue(value.toLowerCase().replaceAll(/\s/g, '-'));
    });

    return form;
  }
}

interface EnvironmentFormType {
  name: FormControl<string>;
  key: FormControl<string>;
  projectId: FormControl<string>;
}
