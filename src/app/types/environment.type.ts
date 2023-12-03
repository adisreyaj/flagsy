import { ProjectMeta } from './project.type';
import { UserMeta } from './user.type';

export interface Environment {
  id: string;
  name: string;
  owner: UserMeta;
  project: ProjectMeta;
}

export interface EnvironmentCreateInput {
  name: string;
  key: string;
  projectId: string;
}
