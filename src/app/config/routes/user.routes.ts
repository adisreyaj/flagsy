import { Route } from '@angular/router';

export const USER_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('../../pages/users/users.component').then((m) => m.UsersComponent),
  },
];
