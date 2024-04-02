import { A11yModule } from '@angular/cdk/a11y';
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
import { UsersService } from '@app/services/users/users.service';
import { UserRole } from '@app/types/user.type';
import {
  ButtonComponent,
  FormFieldComponent,
  InputComponent,
  SelectComponent,
  SelectOptionComponent,
  SheetRef,
} from '@ui/components';
import { capitalize } from 'lodash-es';
import { SelectOption } from '../select.type';

@Component({
  selector: `app-user-invite-sheet`,
  template: ` <div class="flex flex-col h-full">
    <form
      [formGroup]="form"
      class="flex flex-col gap-4 p-6 min-h-0 overflow-y-auto flex-auto max-w-lg"
    >
      <ui-form-field
        label="Email"
        errorMessage="Email is required."
        [showError]="this.hasErrors(this.form.controls.email)"
      >
        <ui-input
          cdkFocusInitial
          formControlName="email"
          placeholder="john@adi.so"
        />
      </ui-form-field>

      <ui-form-field
        label="First Name"
        errorMessage="First Name is required."
        [showError]="this.hasErrors(this.form.controls.firstName)"
      >
        <ui-input
          cdkFocusInitial
          formControlName="firstName"
          placeholder="John"
        />
      </ui-form-field>

      <ui-form-field
        label="Last Name"
        errorMessage="Last Name is required."
        [showError]="this.hasErrors(this.form.controls.lastName)"
      >
        <ui-input
          cdkFocusInitial
          placeholder="Doe"
          formControlName="lastName"
        />
      </ui-form-field>

      <ui-form-field
        class="w-40"
        label="Role"
        errorMessage="Role is required."
        [showError]="this.hasErrors(this.form.controls.role)"
      >
        <ui-select formControlName="role">
          @for (role of this.roles; track role.value) {
            <ui-select-option [label]="role.label" [value]="role.value" />
          }
        </ui-select>
      </ui-form-field>
    </form>
    <footer class="flex items-center gap-3 flex-none px-6 py-4 justify-end">
      <ui-button variant="neutral" label="Close" (click)="this.closeSheet()" />
      <ui-button label="Invite" (click)="this.invite()" />
    </footer>
  </div>`,
  standalone: true,
  imports: [
    FormFieldComponent,
    InputComponent,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    A11yModule,
    SelectComponent,
    SelectOptionComponent,
  ],
})
export class UserInviteSheetComponent {
  protected form: FormGroup<InviteUserFormType>;
  protected readonly submitted = signal(false);
  protected roles: SelectOption<string>[] = Object.values(UserRole).map(
    (role) => ({
      label: capitalize(role),
      value: role,
    }),
  );

  readonly #usersService = inject(UsersService);
  readonly #sheetRef = inject(SheetRef);
  readonly #fb: NonNullableFormBuilder = inject(NonNullableFormBuilder);

  public constructor() {
    this.form = this.#fb.group({
      firstName: this.#fb.control('', Validators.required),
      lastName: this.#fb.control('', Validators.required),
      email: this.#fb.control('', [Validators.required, Validators.email]),
      role: this.#fb.control(UserRole.User, Validators.required),
    });
  }

  protected hasErrors(control: AbstractControl): boolean {
    return (
      (this.submitted() || control.touched || control.dirty) && control.invalid
    );
  }

  protected closeSheet() {
    this.#sheetRef.close();
  }

  protected invite(): void {
    this.submitted.set(true);
    if (this.form.valid) {
      const value = this.form.getRawValue();
      this.#usersService
        .inviteUser({
          email: value.email,
          firstName: value.firstName,
          lastName: value.lastName,
          role: value.role,
        })
        .subscribe(() => {
          this.#sheetRef.close();
          this.#usersService.refresh();
        });
    }
  }
}

interface InviteUserFormType {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  role: FormControl<UserRole>;
}
