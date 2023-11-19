import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import {
  provideRemixIcon,
  RiAddLine,
  RiArchiveDrawerFill,
  RiArchiveDrawerLine,
  RiArrowDownSLine,
  RiBriefcaseFill,
  RiBriefcaseLine,
  RiBuilding2Fill,
  RiBuilding2Line,
  RiCheckLine,
  RiFlagFill,
  RiFlagLine,
  RiHome2Fill,
  RiHome2Line,
} from 'angular-remix-icon';

import { APP_ROUTES } from './config/routes/app.routes';

export const APP_CONFIG: ApplicationConfig = {
  providers: [
    provideRouter(APP_ROUTES),
    provideAnimations(),
    provideHttpClient(),
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
    }),
  ],
};
