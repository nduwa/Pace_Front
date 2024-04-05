export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  institutionId: string | null;
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
  institutions: IInstitution[];
  institution: IInstitution;
  roles: IRole[];
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

export interface IInstitution {
  id: string;
  name: string;
  institutionType: string;
  admin: {
    name: string;
    phone: string;
    email: string;
  };
  details: {
    location: string;
    TIN: string;
  };

  createdAt: Date;
}

export interface IInstitutionRequest
  extends Omit<IInstitution, "id" | "createdAt" | "institutionType"> {
  id?: string;
  institutionType?: string | null;
}

export interface IInstitutionDTO extends IInstitution {
  users?: UserReponse[];
}

export interface IInstitutionResponse {
  type: string;
  rows: IInstitutionDTO[];
}

export interface IRole {
  id: string;
  label: string;
  institutionId: string | null;
  createdAt?: string;
  updatedAt?: string;

  permissions: {
    id: string;
    label: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface IRoleRequest extends Pick<IRole, "label"> {
  permissions?: string[];
}

export interface IAssignPermissionsRequest {
  id?: string;
  roles?: string[];
}

export interface RoleResponseDTO extends IRole {
  permissions: IPermission[];
}

export interface ChangeInstitution {
  institutionId: string;
}
