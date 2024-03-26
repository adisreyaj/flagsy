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
import { InitService } from '@app/services/init/init.service';
import { provideHotToastConfig } from '@ngneat/hot-toast';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { provideRemixIcon } from 'angular-remix-icon';

import { APP_ROUTES } from './config/routes/app.routes';
import { FlagsyTitleStrategy } from './config/routes/flagsy-title.strategy';
import { ICONS } from './icon.config';

export function initializeApp(initService: InitService) {
  return () => {
    return initService.init();
  };
}

export const APP_CONFIG: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideAnimations(),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [InitService],
    },
    {
      provide: TitleStrategy,
      useClass: FlagsyTitleStrategy,
    },
    provideRemixIcon(ICONS),
    provideHotToastConfig({
      role: 'status',
      theme: 'toast',
    }),
    importProvidersFrom(LoadingBarRouterModule),
  ],
};
