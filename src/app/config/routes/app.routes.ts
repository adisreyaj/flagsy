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
            path: AppRoutes.Home,
            title: 'Home',
            data: {
              ...NAVIGATION_DATA_MAP.get(AppRoutes.Home),
            },
            loadComponent: () =>
              import('../../pages/home/home.component').then(
                (m) => m.HomeComponent,
              ),
          },
          {
            path: AppRoutes.Profile,
            title: 'Profile',
            data: {
              ...NAVIGATION_DATA_MAP.get(AppRoutes.Profile),
            },
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
            path: AppRoutes.Users,
            title: 'Users',
            data: {
              ...NAVIGATION_DATA_MAP.get(AppRoutes.Users),
            },
            loadChildren: () =>
              import('./user.routes').then((m) => m.USER_ROUTES),
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
            path: AppRoutes.Changelog,
            title: 'Changelog',
            data: {
              ...NAVIGATION_DATA_MAP.get(AppRoutes.Changelog),
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
  Home = '',
  Login = 'login',
  Register = 'register',
  Orgs = 'orgs',
  Users = 'users',
  Projects = 'projects',
  Environments = 'environments',
  Features = 'features',
  Profile = 'profile',
  Changelog = 'changelog',
}
