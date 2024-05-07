import Secure from "../pages/secure/Secure";
import { IRoute } from "../types/common";
import drugsRoutes from "./drugs.routes";
import institionsRoute from "./institution.route";
import patientsRoutes from "./patients.rountes";
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
  ...drugsRoutes,
  ...patientsRoutes,
];
export default routes;
