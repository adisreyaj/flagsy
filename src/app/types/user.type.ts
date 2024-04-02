export interface UserMeta {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserWithRole extends UserMeta {
  role: UserRole;
  scopes: string[];
}

export type UserInviteData = Omit<UserWithRole, 'id' | 'scopes'>;

export enum UserRole {
  Admin = 'ADMIN',
  User = 'USER',
}
