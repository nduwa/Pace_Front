import { PermissionGroup } from "../constants/permissions";
import { AuthContext } from "../context/Auth";
import { useContext } from "react";

export const HasPermissionGroup = (
  requiredGroup: PermissionGroup,
  superAdmin: boolean = false,
) => {
  const authCtx = useContext(AuthContext);
  const hasSUDO = authCtx && authCtx.permissionsGroups.includes("SUDO");
  const hasADMIN = authCtx && authCtx.permissionsGroups.includes("ADMIN");

  return superAdmin
    ? hasSUDO
    : hasSUDO ||
        hasADMIN ||
        (authCtx && authCtx.permissionsGroups.includes(requiredGroup));
};
