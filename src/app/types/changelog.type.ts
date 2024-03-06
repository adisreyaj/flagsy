import { TableSortDirection } from '@ui/components';

export interface FeatureChangelogSortBy {
  key?: FeatureChangelogSortKey;
  direction?: TableSortDirection;
}
export enum FeatureChangelogSortKey {
  Date = 'date',
  Feature = 'feature',
}
