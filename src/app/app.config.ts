import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { APP_ROUTES } from './config/routes/app.routes';

export const APP_CONFIG: ApplicationConfig = {
  providers: [provideRouter(APP_ROUTES), provideAnimations()],
};
