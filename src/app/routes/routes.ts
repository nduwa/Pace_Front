import Secure from "../pages/secure/Secure";
import { IRoute } from "../types/common";
import institionsRoute from "./institution.route";
import rolesRoutes from "./roles.route";
import usersRoutes from "./users.routes";

const routes: IRoute[] = [
  {
    path: "",
    element: Secure,
  },

  ...usersRoutes,
  ...institionsRoute,
  ...rolesRoutes,
];
export default routes;
