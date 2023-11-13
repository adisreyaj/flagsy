import { Route } from '@angular/router';

export const FEATURE_KEY_NAV_PARAM = 'featureKey';

export const FEATURE_ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('../../pages/features/features.component').then(
        (m) => m.FeaturesComponent,
      ),
  },
];
