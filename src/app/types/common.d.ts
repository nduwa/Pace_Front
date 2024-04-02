export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  createdAt: Date;
}

export interface IPermission {
  id: string;
  label: string;
  createdAt?: string;
  updatedAt?: string;
}

export type UserPermission = Pick<IPermission, "id" | "label">;

export interface IUserWithPermissions extends IUser {
  permissions: UserPermission[];
}

export interface IUserProfile extends Partial<IUser> {
  HD?: string;
}

export interface AuthState extends Pick<IUser, "name" | "email" | "phone"> {
  accessToken: string;
}

export interface IRoute {
  path: string;
  element: ComponentType<unknown>;
  allowedPermissionGroup?: PermissionGroup;
  allowedPermissions?: Permission[];
  superAdmin?: boolean;
}

export interface IPermissionsGroup {
  group: string;
  permissions: string[];
}

export type IUUID = string;

export interface IPaged<T> {
  data: T;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface IUsersResponse {
  role: string;
  gender: string;
  department: string;
  rows: UserResponse[];
}
