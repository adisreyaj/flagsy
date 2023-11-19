import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '@app/services/auth/auth.service';
import {
  ButtonComponent,
  FormFieldComponent,
  InputComponent,
} from '@ui/components';

@Component({
  selector: 'app-login',
  template: ` <div class="">
    <form
      [formGroup]="this.form"
      class="flex flex-col gap-4 p-6 min-h-0 overflow-y-auto flex-auto max-w-lg"
    >
      <ui-form-field label="Email" errorMessage="Email is required.">
        <ui-input formControlName="email" placeholder="john@doe.com"></ui-input>
      </ui-form-field>

      <ui-form-field label="Password" errorMessage="Password is required.">
        <ui-input formControlName="password"></ui-input>
      </ui-form-field>

      <ui-button label="Login" (click)="this.login()"></ui-button>
    </form>
  </div>`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormFieldComponent,
    InputComponent,
    ReactiveFormsModule,
    ButtonComponent,
  ],
})
export class LoginComponent {
  protected readonly form: FormGroup<LoginFormType>;

  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly authService = inject(AuthService);

  constructor() {
    this.form = this.fb.group<LoginFormType>({
      email: this.fb.control('hi@adi.so', [Validators.required]),
      password: this.fb.control('password', [Validators.required]),
    });
  }

  public login(): void {
    const { email, password } = this.form.getRawValue();
    this.authService.login(email, password).subscribe();
  }
}

interface LoginFormType {
  email: FormControl<string>;
  password: FormControl<string>;
}
