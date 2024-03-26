export interface UserMeta {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserWithRole extends UserMeta {
  role: string;
  scopes: string[];
}
