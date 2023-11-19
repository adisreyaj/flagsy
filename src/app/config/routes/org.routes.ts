import { Route } from '@angular/router';

export const ORG_ID_NAV_PARAM = 'orgId';

export const ORG_ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('../../pages/orgs/orgs.component').then((m) => m.OrgsComponent),
  },
];
