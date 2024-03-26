import { IconName } from 'angular-remix-icon/lib/icon-names';
import { FeatureFlag } from './feature.config';
import { AppRoutes } from './routes/app.routes';

export const NAVIGATION_DATA: NavigationEntry[] = [
  {
    path: AppRoutes.Home,
    title: 'Home',
    icon: 'home-2-line',
    activeIcon: 'home-2-fill',
  },
  {
    path: AppRoutes.Orgs,
    title: 'Orgs',
    icon: 'building-2-line',
    activeIcon: 'building-2-fill',
    featureFlags: FeatureFlag.Orgs,
  },
  {
    path: AppRoutes.Users,
    title: 'Users',
    icon: 'user-3-line',
    activeIcon: 'user-3-fill',
    featureFlags: FeatureFlag.Users,
  },
  {
    path: AppRoutes.Projects,
    title: 'Projects',
    icon: 'briefcase-line',
    activeIcon: 'briefcase-fill',
  },
  {
    path: AppRoutes.Environments,
    title: 'Environments',
    icon: 'archive-drawer-line',
    activeIcon: 'archive-drawer-fill',
  },
  {
    path: AppRoutes.Features,
    title: 'Features',
    icon: 'flag-line',
    activeIcon: 'flag-fill',
  },
  {
    path: AppRoutes.Changelog,
    title: 'Changelog',
    icon: 'lock-line',
    activeIcon: 'lock-fill',
  },
];

export const NAVIGATION_DATA_MAP = new Map<string, NavigationEntry>(
  NAVIGATION_DATA.map((entry) => [entry.path, entry]),
);

export interface NavigationEntry {
  path: string;
  title: string;
  icon: IconName;
  activeIcon: IconName;
  featureFlags?: string | string[];
  visible?: boolean;
}
