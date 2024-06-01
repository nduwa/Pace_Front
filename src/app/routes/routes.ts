import Secure from "../pages/secure/Secure";
import { IRoute } from "../types/common";
import drugsRoutes from "./drugs.routes";
import examRoutes from "./exams.route";
import institionsRoute from "./institution.route";
import invoicessRoutes from "./invoices.route";
import patientsRoutes from "./patients.rountes";
import rolesRoutes from "./roles.route";
import transactionRoutes from "./transaction.route";
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
  ...transactionRoutes,
  ...invoicessRoutes,
  ...examRoutes,
];
export default routes;
