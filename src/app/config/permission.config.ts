export enum Scope {
  Feature = 'feature',
  Org = 'org',
  User = 'user',
  Project = 'project',
  Environment = 'environment',
  ChangeLog = 'changelog',
}

export enum PermissionType {
  Write = 'write',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export const Permissions = Object.values(Scope).reduce(
  (acc, scope) => {
    const permissionsOfScope = Object.values(PermissionType).reduce(
      (acc, permission) => {
        return {
          ...acc,
          [permission]: `${scope}:${permission}`,
        };
      },
      {} as Record<PermissionType, string>,
    );
    return {
      ...acc,
      [scope]: permissionsOfScope,
    };
  },
  {} as Record<Scope, Record<PermissionType, string>>,
);
