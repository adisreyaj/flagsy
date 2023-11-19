import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: AppRoutes.Login,
    loadComponent: () =>
      import('../../pages/auth/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: '',
    loadChildren: () => [
      {
        path: '',
        loadComponent: () =>
          import('../../shell.component').then((m) => m.ShellComponent),
        children: [
          {
            path: AppRoutes.Orgs,
            loadChildren: () =>
              import('./org.routes').then((m) => m.ORG_ROUTES),
          },
          {
            path: AppRoutes.Projects,
            loadChildren: () =>
              import('./project.routes').then((m) => m.PROJECT_ROUTES),
          },
          {
            path: AppRoutes.Environments,
            loadChildren: () =>
              import('./environment.routes').then((m) => m.ENVIRONMENT_ROUTES),
          },
          {
            path: AppRoutes.Features,
            loadChildren: () =>
              import('./feature.routes').then((m) => m.FEATURE_ROUTES),
          },
        ],
      },
    ],
  },
];

export const enum AppRoutes {
  Login = 'login',
  Register = 'register',
  Orgs = 'orgs',
  Projects = 'projects',
  Environments = 'environments',
  Features = 'features',
}
