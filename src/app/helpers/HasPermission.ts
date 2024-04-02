import { Permission } from "../constants/permissions";
import { AuthContext } from "../context/Auth";
import { useContext } from "react";

type ExtendedPermission = Permission | "EMPLOYEE" | "DEPARTMENT_HEAD";

export const HasPermission = (
  permissions: ExtendedPermission[],
  superAdmin: boolean = false,
) => {
  const authCtx = useContext(AuthContext);

  const hasSUDO = authCtx && authCtx.permissionsGroups.includes("SUDO");
  const hasADMIN = authCtx && authCtx.permissionsGroups.includes("ADMIN");

  return superAdmin
    ? hasSUDO
    : hasSUDO ||
        hasADMIN ||
        (authCtx &&
          authCtx!.permissions.some((permission) =>
            permissions.includes(permission),
          ));
};
