import { ReactNode } from "react";
import { Permission } from "../../constants/permissions";
import { HasPermission } from "../../helpers/HasPermission";

interface IProtected {
  permissions: Permission[];
  children: ReactNode;
  superAdmin?: boolean;
}
const Protected = ({ permissions, children, superAdmin = false }: IProtected) => {
  return HasPermission(permissions, superAdmin) || !permissions[0] ? (
    <>{children}</>
  ) : (
    <></>
  );
};

export default Protected;
