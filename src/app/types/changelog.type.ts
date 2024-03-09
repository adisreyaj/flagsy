import { Environment } from './environment.type';
import { Feature } from './feature.type';
import { UserMeta } from './user.type';

export enum FeatureChangelogSortKey {
  Date = 'date',
  Feature = 'feature',
}

export enum FeatureChangeLogType {
  Create = 'CREATE',
  ValueChange = 'VALUE_CHANGE',
  Delete = 'DELETE',
}

export interface FeatureChangelogResponse {
  data: FeatureChangelog[];
  total: number;
}

export interface FeatureChangelog {
  feature: Pick<Feature, 'key' | 'id'>;
  environment?: Pick<Environment, 'name' | 'id'>;
  owner: UserMeta;
  change?: FeatureChangelogChangeData;
  type: FeatureChangeLogType;
  createdAt: Date;
}

export interface FeatureChangelogChangeData {
  old: {
    value: string;
  };
  new: {
    value: string;
  };
}
