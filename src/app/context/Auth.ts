import { Permission, PermissionGroup } from "../constants/permissions";
import { IUserProfile, IUserWithPermissions } from "./../types/common.d";
import { createContext } from "react";

export interface IAuthContext {
  userProfile: IUserProfile | undefined;
  setUserProfile: (userProfile: IUserWithPermissions) => void;
  permissionsGroups: PermissionGroup[];
  permissions: Permission[];
}

export const AuthContext = createContext<IAuthContext | null>(null);
