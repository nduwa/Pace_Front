import { Permission, PermissionGroup } from "../constants/permissions";
import { IUserWithPermissions } from "./../types/common.d";
import { createContext } from "react";

export interface IAuthContext {
  userProfile: IUserWithPermissions | undefined;
  setUserProfile: (userProfile: IUserWithPermissions) => void;
  permissionsGroups: PermissionGroup[];
  permissions: Permission[];
}

export const AuthContext = createContext<IAuthContext | null>(null);
