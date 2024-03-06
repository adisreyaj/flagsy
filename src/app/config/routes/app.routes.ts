import { Routes } from '@angular/router';
import { alreadyLoggedInGuard, loggedInGuard } from '../../guards/auth.guard';
import { NAVIGATION_DATA_MAP } from '../navigation-definition.data';

export const APP_ROUTES: Routes = [
  {
    path: AppRoutes.Login,
    canMatch: [alreadyLoggedInGuard],
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
        canMatch: [loggedInGuard],
        loadComponent: () =>
          import('../../shell.component').then((m) => m.ShellComponent),
        children: [
          {
            path: AppRoutes.Profile,
            title: 'Profile',
            data: {
              ...NAVIGATION_DATA_MAP.get(AppRoutes.Profile),
            },
            canMatch: [loggedInGuard],
            loadComponent: () =>
              import('../../pages/profile/profile.component').then(
                (m) => m.ProfileComponent,
              ),
          },
          {
            path: AppRoutes.Orgs,
            title: 'Orgs',
            data: {
              ...NAVIGATION_DATA_MAP.get(AppRoutes.Orgs),
            },
            loadChildren: () =>
              import('./org.routes').then((m) => m.ORG_ROUTES),
          },
          {
            path: AppRoutes.Projects,
            title: 'Projects',
            data: {
              ...NAVIGATION_DATA_MAP.get(AppRoutes.Projects),
            },
            loadChildren: () =>
              import('./project.routes').then((m) => m.PROJECT_ROUTES),
          },
          {
            path: AppRoutes.Environments,
            title: 'Environments',
            data: {
              ...NAVIGATION_DATA_MAP.get(AppRoutes.Environments),
            },
            loadChildren: () =>
              import('./environment.routes').then((m) => m.ENVIRONMENT_ROUTES),
          },
          {
            path: AppRoutes.Features,
            title: 'Features',
            data: {
              ...NAVIGATION_DATA_MAP.get(AppRoutes.Features),
            },
            loadChildren: () =>
              import('./feature.routes').then((m) => m.FEATURE_ROUTES),
          },
          {
            path: AppRoutes.ChangeLog,
            title: 'Changelog',
            data: {
              ...NAVIGATION_DATA_MAP.get(AppRoutes.ChangeLog),
            },
            loadChildren: () =>
              import('./changelog.routes').then((m) => m.CHANGELOG_ROUTES),
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
  Profile = 'profile',
  ChangeLog = 'changelog',
}
