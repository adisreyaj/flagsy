import { AsyncPipe } from '@angular/common';
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
import {
  ButtonComponent,
  FormFieldComponent,
  InputComponent,
  SelectComponent,
  SelectOptionComponent,
  SheetRef,
} from '@ui/components';

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
        <ui-input formControlName="name" placeholder="Eg: staging"></ui-input>
      </ui-form-field>
    </form>
    <footer class="flex items-center gap-3 flex-none px-6 py-4 justify-end ">
      <ui-button
        variant="neutral"
        label="Close"
        (click)="this.closeSheet()"
      ></ui-button>
      <ui-button label="Continue" (click)="this.saveEnvironment()"></ui-button>
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
  ],
})
export class EnvironmentConfigSheetComponent {
  protected readonly form: FormGroup<EnvironmentFormType>;
  protected readonly submitted = signal(false);

  private readonly environmentService = inject(EnvironmentsService);

  private readonly sheetRef = inject(SheetRef);
  private readonly fb: NonNullableFormBuilder = inject(FormBuilder).nonNullable;

  constructor() {
    this.form = this.fb.group<EnvironmentFormType>({
      name: this.fb.control('', Validators.required),
      projectId: this.fb.control('', Validators.required),
    });
  }

  hasErrors(control: AbstractControl): boolean {
    return (
      this.submitted() && (control.touched || control.dirty) && control.invalid
    );
  }

  closeSheet() {
    this.sheetRef.close();
  }

  public saveEnvironment(): void {
    this.environmentService
      .createEnvironment({
        name: this.form.controls.name.value,
        projectId: 'cloy8rqy40001xc2kaqlv7hs5',
      })
      .subscribe({
        next: () => {
          this.closeSheet();
        },
      });
  }
}

interface EnvironmentFormType {
  name: FormControl<string>;
  projectId: FormControl<string>;
}
