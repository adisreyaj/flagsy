import { provideHttpClient } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
} from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
} from '@angular/router';
import { AccessService } from '@app/services/access/access.service';
import { AuthService } from '@app/services/auth/auth.service';
import { provideHotToastConfig } from '@ngneat/hot-toast';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { provideRemixIcon } from 'angular-remix-icon';
import { switchMap } from 'rxjs';

import { APP_ROUTES } from './config/routes/app.routes';
import { FlagsyTitleStrategy } from './config/routes/flagsy-title.strategy';
import { ICONS } from './icon.config';

export function initializeApp(
  authService: AuthService,
  accessService: AccessService,
) {
  return () => {
    return authService
      .fetchUserDetails()
      .pipe(switchMap(() => accessService.init()));
  };
}

export const APP_CONFIG: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient(),
    provideRemixIcon(ICONS),
    provideHotToastConfig({
      role: 'status',
      theme: 'toast',
    }),
    importProvidersFrom(LoadingBarRouterModule),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [AuthService, AccessService],
    },
    {
      provide: TitleStrategy,
      useClass: FlagsyTitleStrategy,
    },
  ],
};
