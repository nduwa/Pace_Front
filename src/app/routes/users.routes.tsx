import UsersPage from "../pages/users/UsersPage";
import { IRoute } from "../types/common";

const usersRoutes: IRoute[] = [
  {
    path: "users",
    element: UsersPage,
    allowedPermissionGroup: "USERS",
  },
];

export default usersRoutes;
