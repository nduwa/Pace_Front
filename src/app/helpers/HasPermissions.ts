import { Permission } from "../constants/permissions";
import { AuthContext } from "../context/Auth";
import { useContext } from "react";

export const HasPermissions = (permissions: Permission[]) => {
  const authCtx = useContext(AuthContext);

  const hasSUDO = authCtx && authCtx.permissionsGroups.includes("SUDO");
  const hasADMIN = authCtx && authCtx.permissionsGroups.includes("ADMIN");
  const authCtxPermissions = new Set(authCtx?.permissions);

  return hasSUDO || hasADMIN
    ? permissions
    : permissions.filter((permission) => authCtxPermissions.has(permission));
};
