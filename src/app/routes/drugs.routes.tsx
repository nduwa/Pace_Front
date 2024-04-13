import DrugsPage from "../pages/drugs/DrugsPage";
import { IRoute } from "../types/common";

const drugsRoutes: IRoute[] = [
  {
    path: "drugs",
    element: DrugsPage,
    allowedPermissionGroup: "MEDECINES",
  },
];

export default drugsRoutes;
