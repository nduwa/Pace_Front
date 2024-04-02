import { useEffect, useState } from "react";
import { AuthContext } from "../../context/Auth";
import { IUserWithPermissions } from "../../types/common";
import { Permission, PermissionGroup } from "../../constants/permissions";
import { getUserPermissionGroups } from "../auth";
import { ReactNode } from "react";

interface IAuthContextProvider {
  children: ReactNode;
}
const AuthContextProvider = ({ children }: IAuthContextProvider) => {
  const [userProfile, setUser] = useState<IUserWithPermissions>();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionsGroups, setPermissionsGroups] = useState<PermissionGroup[]>([]);

  const setUserProfile = (user: IUserWithPermissions) => {
    setUser(user);
  };
  useEffect(() => {
    if (userProfile) {
      const currentUserPermissions = userProfile.permissions.map(
        (permission) => permission.label,
      ) as unknown as Permission[];
      setPermissions(currentUserPermissions);
      setPermissionsGroups(getUserPermissionGroups(currentUserPermissions));
    }
  }, [userProfile]);
  return (
    <AuthContext.Provider
      value={{
        userProfile,
        setUserProfile,
        permissions,
        permissionsGroups,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
