import CreateRolePage from "../pages/roles/CreateRolePage";
import RolesPage from "../pages/roles/RolesPage";
import { IRoute } from "../types/common";

const rolesRoutes: IRoute[] = [
  {
    path: "roles",
    element: RolesPage,
    allowedPermissionGroup: "ADMIN",
  },
  {
    path: "roles/create",
    element: CreateRolePage,
    allowedPermissionGroup: "ADMIN",
  },
];

export default rolesRoutes;
