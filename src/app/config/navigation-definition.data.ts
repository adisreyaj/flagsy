import { AppRoutes } from './routes/app.routes';

export const NAVIGATION_DATA: NavigationEntry[] = [
  {
    id: 'environments',
    title: 'Environments',
    route: ['/', AppRoutes.Environments],
  },
  {
    id: 'projects',
    title: 'Projects',
    route: ['/', AppRoutes.Projects],
  },
  {
    id: 'features',
    title: 'Features',
    route: ['/', AppRoutes.Features],
  },
];

export interface NavigationEntry {
  route: string[];
  id: string;
  title: string;
}
