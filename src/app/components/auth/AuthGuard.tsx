import { ReactElement } from "react";
import { Permission, PermissionGroup } from "../../constants/permissions";
import Forbidden from "./Forbidden";
import { HasPermissionGroup } from "../../helpers/HasPermissionGroup";
import { HasPermissions } from "../../helpers/HasPermissions";

interface IRouteGuard {
  children: ReactElement;
  requiredGroup: PermissionGroup;
  requiredPermissions?: Permission[];
  superAdmin?: boolean;
}
const AuthGuard = ({
  children,
  requiredGroup,
  requiredPermissions = [],
  superAdmin = false,
}: IRouteGuard) => {
  const hasPermissions =
    requiredPermissions.length > 0 ? HasPermissions(requiredPermissions) : true;
  const hasPermissionGroup = HasPermissionGroup(requiredGroup, superAdmin);
  const allowed =
    requiredPermissions.length > 0
      ? hasPermissionGroup || hasPermissions
      : hasPermissionGroup;

  return allowed ? <>{children}</> : <Forbidden />;
};

export default AuthGuard;
