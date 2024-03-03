interface FeatureBase {
  id: string;
  key: string;
  description: string;
  segmentOverrides: SegmentOverride[];
  createdBy: FeatureUser;
  createdAt: Date;
  archived: boolean;
  updatedAt?: Date;
  lastUpdatedBy?: FeatureUser;
}
export type Feature =
  | BooleanFeature
  | StringFeature
  | NumberFeature
  | JsonFeature;

export interface BooleanFeature extends FeatureBase {
  type: FeatureValueType.Boolean;
  value: boolean;
  environmentOverrides: EnvironmentOverride[];
}

export interface StringFeature extends FeatureBase {
  type: FeatureValueType.String;
  value: string;
  environmentOverrides: EnvironmentOverride[];
}

export interface NumberFeature extends FeatureBase {
  type: FeatureValueType.Number;
  value: number;
  environmentOverrides: EnvironmentOverride[];
}
export interface JsonFeature extends FeatureBase {
  type: FeatureValueType.Boolean;
  value: boolean;
  environmentOverrides: EnvironmentOverride[];
}

export interface FeatureCreateData {
  key: string;
  projectId: string;
  valueType: FeatureValueType;
  description?: string;
  value: SupportedFeatureValueTypes;
  environmentOverrides: {
    environmentId: string;
    value: SupportedFeatureValueTypes;
  }[];
}

export type FeatureUpdateData = Omit<
  FeatureCreateData,
  'environmentOverrides'
> & {
  environmentId: string;
};

export interface FeatureUser {
  id: string;
  firstName: string;
  lastName: string;
}

export interface EnvironmentOverride {
  environmentId: string;
  value: FeatureValue;
}

export interface SegmentOverride {
  segmentId: string;
  value: FeatureValue;
}

export type FeatureValue =
  | {
      type: FeatureValueType.Boolean;
      value: boolean;
    }
  | {
      type: FeatureValueType.String;
      value: string;
    }
  | {
      type: FeatureValueType.Number;
      value: number;
    }
  | {
      type: FeatureValueType.Json;
      value: string;
    };

export enum FeatureValueType {
  Boolean = 'BOOLEAN',
  String = 'STRING',
  Number = 'NUMBER',
  Json = 'JSON',
}

export type SupportedFeatureValueTypes = boolean | string | number | object;

export enum FeatureSortBy {
  Key = 'key',
  LastUpdated = 'updatedAt',
}
