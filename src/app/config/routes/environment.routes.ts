import { ActivatedRouteSnapshot, Route } from '@angular/router';

export const ENVIRONMENT_ID_NAV_PARAM = 'environmentId';
export const ENVIRONMENT_ID_DETAILS_SECTION = 'detailsSection';

export const ENVIRONMENT_ROUTES: Route[] = [
  {
    path: '',
    children: [
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
        resolve: {
          environmentId: (route: ActivatedRouteSnapshot) => {
            return route.paramMap.get(ENVIRONMENT_ID_NAV_PARAM);
          },
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('../../pages/environments/environments.component').then(
                (m) => m.EnvironmentsComponent,
              ),
          },
          {
            path: `:${ENVIRONMENT_ID_DETAILS_SECTION}`,
            resolve: {
              environmentId: (route: ActivatedRouteSnapshot) => {
                return route.paramMap.get(ENVIRONMENT_ID_NAV_PARAM);
              },
              section: (route: ActivatedRouteSnapshot) => {
                return route.paramMap.get(ENVIRONMENT_ID_DETAILS_SECTION);
              },
            },
            loadComponent: () =>
              import('../../pages/environments/environments.component').then(
                (m) => m.EnvironmentsComponent,
              ),
          },
        ],
      },
    ],
  },
];

export enum EnvironmentSectionRoute {
  General = 'general',
  AccessKeys = 'access-keys',
  Webhooks = 'webhooks',
}
