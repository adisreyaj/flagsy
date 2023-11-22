import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '@app/services/auth/auth.service';

export const loggedInGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  } else {
    return true;
  }
};

export const alreadyLoggedInGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoggedIn()) {
    return router.createUrlTree(['/']);
  } else {
    return true;
  }
};
