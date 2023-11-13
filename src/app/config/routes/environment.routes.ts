import { Route } from '@angular/router';

export const ENVIRONMENT_ID_NAV_PARAM = 'environmentId';

export const ENVIRONMENT_ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('../../pages/environments/environments.component').then(
        (m) => m.EnvironmentsComponent,
      ),
  },
  {
    path: `:${ENVIRONMENT_ID_NAV_PARAM}`,
    loadComponent: () =>
      import(
        '../../pages/environment-detail/environment-detail.component'
      ).then((m) => m.EnvironmentDetailComponent),
  },
];
