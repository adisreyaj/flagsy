export interface OrgMeta {
  id: string;
  name: string;
  key: string;
}

export interface Org extends OrgMeta {
  count: {
    members: number;
    projects: number;
    environments: number;
    features: number;
  };
}
