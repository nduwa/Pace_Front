import Secure from "../pages/secure/Secure";
import { IRoute } from "../types/common";
import usersRoutes from "./users.routes";

const routes: IRoute[] = [
  {
    path: "",
    element: Secure,
  },

  ...usersRoutes,
];
export default routes;
