import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { AuthService } from '@app/services/auth/auth.service';
import { provideHotToastConfig } from '@ngneat/hot-toast';
import { provideRemixIcon } from 'angular-remix-icon';
import { Observable } from 'rxjs';

import { APP_ROUTES } from './config/routes/app.routes';
import { ICONS } from './icon.config';

export function initializeApp(authService: AuthService) {
  return (): Observable<void> => authService.fetchUserDetails();
}

export const APP_CONFIG: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES),
    provideAnimations(),
    provideHttpClient(),
    provideRemixIcon(ICONS),
    provideHotToastConfig({
      role: 'status',
      theme: 'toast',
    }),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [AuthService],
    },
  ],
};
