import { UserMeta } from './user.type';

export interface Project extends ProjectMeta {
  owner: UserMeta;
}

export interface ProjectMeta extends ProjectCreateInput {
  id: string;
}

export interface ProjectCreateInput {
  key: string;
  name: string;
}
