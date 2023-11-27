export type Feature = {
  id: string;
  key: string;
  description: string;
  segmentOverrides: SegmentOverride[];
  createdBy: FeatureUser;
  createdAt: Date;
  archived: boolean;
  lastUpdated?: Date;
  lastUpdatedBy?: FeatureUser;
} & FeatureValue;

export interface FeatureCreateData {
  key: string;
  projectId: string;
  valueType: FeatureValueType;
  value: SupportedFeatureValueTypes;
  environmentOverrides: {
    environmentId: string;
    value: SupportedFeatureValueTypes;
  }[];
}

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
