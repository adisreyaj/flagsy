import { OrgMeta } from './org.type';
import { UserMeta } from './user.type';

export interface Project extends ProjectMeta {
  owner: UserMeta;
  org: OrgMeta;
  count: {
    features: number;
    environments: number;
  };
}

export interface ProjectMeta extends ProjectCreateInput {
  id: string;
}

export interface ProjectCreateInput {
  key: string;
  name: string;
}
