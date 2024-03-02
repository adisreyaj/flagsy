import { Route } from '@angular/router';

export const PROJECT_ID_NAV_PARAM = 'projectId';

export const PROJECT_ROUTES: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Projects',
    loadComponent: () =>
      import('../../pages/projects/projects.component').then(
        (m) => m.ProjectsComponent,
      ),
  },
  {
    path: `:${PROJECT_ID_NAV_PARAM}`,
    loadComponent: () =>
      import('../../pages/project-detail/project-detail-component').then(
        (m) => m.ProjectDetailComponent,
      ),
  },
];
