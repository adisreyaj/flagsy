import { provideHttpClient } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { AuthService } from '@app/services/auth/auth.service';
import {
  provideRemixIcon,
  RiAddLine,
  RiArchiveDrawerFill,
  RiArchiveDrawerLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiBriefcaseFill,
  RiBriefcaseLine,
  RiBuilding2Fill,
  RiBuilding2Line,
  RiCheckLine,
  RiFlagFill,
  RiFlagLine,
  RiHome2Fill,
  RiHome2Line,
  RiLockPasswordLine,
  RiMailLine,
  RiSearchLine,
} from 'angular-remix-icon';
import { Observable } from 'rxjs';

import { APP_ROUTES } from './config/routes/app.routes';

export function initializeApp(authService: AuthService) {
  return (): Observable<void> => authService.fetchUserDetails();
}

export const APP_CONFIG: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES),
    provideAnimations(),
    provideHttpClient(),

    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [AuthService],
    },
    provideRemixIcon({
      RiArrowDownSLine,
      RiCheckLine,
      RiAddLine,
      RiFlagLine,
      RiBriefcaseLine,
      RiArchiveDrawerLine,
      RiHome2Line,
      RiFlagFill,
      RiBriefcaseFill,
      RiArchiveDrawerFill,
      RiHome2Fill,
      RiBuilding2Line,
      RiBuilding2Fill,
      RiSearchLine,
      RiArrowRightSLine,
      RiMailLine,
      RiLockPasswordLine,
    }),
  ],
};
