import { Route } from '@angular/router';

export const CHANGELOG_ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('../../pages/changelog/changelog.component').then(
        (m) => m.ChangelogComponent,
      ),
  },
];
