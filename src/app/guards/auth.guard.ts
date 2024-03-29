import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AccessService } from '@app/services/access/access.service';
import { AuthService } from '@app/services/auth/auth.service';
import { map } from 'rxjs';

export const loggedInGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const accessService = inject(AccessService);
  const router = inject(Router);
  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  } else {
    return accessService.init().pipe(map(() => true));
  }
};

export const alreadyLoggedInGuard: CanMatchFn = () => {
  const authService = inject(AuthService);
  const accessService = inject(AccessService);
  const router = inject(Router);
  if (authService.isLoggedIn()) {
    return accessService.init().pipe(map(() => router.createUrlTree(['/'])));
  } else {
    return true;
  }
};
