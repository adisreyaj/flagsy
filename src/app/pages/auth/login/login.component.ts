import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/services/auth/auth.service';
import {
  ButtonComponent,
  CheckboxComponent,
  FormFieldComponent,
  InputComponent,
} from '@ui/components';
import { finalize } from 'rxjs';
import { FormUtil } from '../../../utils/form.util';

@Component({
  selector: 'app-login',
  template: ` <div class="grid grid-cols-1 md:grid-cols-2 h-screen">
    <section class="w-full h-full bg-primary-500 md:block hidden"></section>
    <section class="flex items-center justify-center">
      <div class="flex flex-col">
        <header class="flex flex-col gap-6 items-center justify-center">
          <img src="/assets/images/logo-full.svg" class="h-10" />
          <div class="flex flex-col items-center gap-2">
            <h2 class="font-bold text-3xl">Welcome Back!</h2>
            <p>Please login to continue</p>
          </div>
        </header>
        <form
          [formGroup]="this.form"
          class="flex flex-col gap-4 w-96 p-6 min-h-0 overflow-y-auto flex-auto max-w-lg"
        >
          <ui-form-field
            label="Email"
            [showError]="this.hasErrors(this.form.controls.email)"
            errorMessage="Email is required."
          >
            <ui-input
              prefixIcon="mail-line"
              formControlName="email"
              placeholder="john@doe.com"
            ></ui-input>
          </ui-form-field>

          <ui-form-field
            label="Password"
            [showError]="this.hasErrors(this.form.controls.password)"
            errorMessage="Password is required."
          >
            <ui-input
              prefixIcon="lock-password-line"
              formControlName="password"
            ></ui-input>
          </ui-form-field>

          <footer
            class="font-semibold text-xs flex justify-between items-center"
          >
            <ui-checkbox label="Remember Me"></ui-checkbox>
            <div class="text-primary-500  ">
              <a class="link" href="/signup">Forgot Password?</a>
            </div>
          </footer>

          <ui-button
            class="block h-full"
            label="Login"
            [disabled]="this.inProgress()"
            (click)="this.login()"
          ></ui-button>
        </form>
        <footer class="flex justify-center">
          <div class="text-xs flex gap-1">
            <span> Don't have an account? </span>
            <span class="text-primary-500 font-semibold">
              <a class="link" href="/signup">Create Account</a>
            </span>
          </div>
        </footer>
      </div>
    </section>
  </div>`,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormFieldComponent,
    InputComponent,
    ReactiveFormsModule,
    ButtonComponent,
    CheckboxComponent,
  ],
})
export class LoginComponent {
  protected readonly inProgress = signal(false);
  protected readonly submitted = signal(false);
  protected readonly form: FormGroup<LoginFormType>;

  private readonly fb = inject(FormBuilder).nonNullable;
  private readonly authService = inject(AuthService);
  protected readonly router = inject(Router);

  constructor() {
    this.form = this.fb.group<LoginFormType>({
      email: this.fb.control('hi@adi.so', [
        Validators.required,
        Validators.email,
      ]),
      password: this.fb.control('password', [Validators.required]),
    });
  }

  hasErrors(control: AbstractControl): boolean {
    return FormUtil.hasErrors(control, this.submitted());
  }

  login(): void {
    this.submitted.set(true);
    if (this.form.valid) {
      const { email, password } = this.form.getRawValue();
      this.inProgress.set(true);
      this.authService
        .login(email, password)
        .pipe(
          finalize(() => {
            this.inProgress.set(false);
          }),
        )
        .subscribe({
          next: () => {
            this.router.navigate(['/']);
          },
        });
    }
  }
}

interface LoginFormType {
  email: FormControl<string>;
  password: FormControl<string>;
}
