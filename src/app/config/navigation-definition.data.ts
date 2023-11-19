import { IconName } from 'angular-remix-icon/lib/icon-names';
import { AppRoutes } from './routes/app.routes';

export const NAVIGATION_DATA: NavigationEntry[] = [
  {
    id: 'orgs',
    title: 'Orgs',
    route: ['/', AppRoutes.Orgs],
    icon: 'building-2-line',
    activeIcon: 'building-2-fill',
  },
  {
    id: 'projects',
    title: 'Projects',
    route: ['/', AppRoutes.Projects],
    icon: 'briefcase-line',
    activeIcon: 'briefcase-fill',
  },
  {
    id: 'environments',
    title: 'Environments',
    route: ['/', AppRoutes.Environments],
    icon: 'archive-drawer-line',
    activeIcon: 'archive-drawer-fill',
  },
  {
    id: 'features',
    title: 'Features',
    route: ['/', AppRoutes.Features],
    icon: 'flag-line',
    activeIcon: 'flag-fill',
  },
];

export interface NavigationEntry {
  route: string[];
  id: string;
  title: string;
  icon: IconName;
  activeIcon: IconName;
}
