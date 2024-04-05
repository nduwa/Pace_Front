import InstitutionsPage from "../pages/institution/InstitutionsPage";
import { IRoute } from "../types/common";

const institionsRoute: IRoute[] = [
  {
    path: "institutions",
    element: InstitutionsPage,
    allowedPermissionGroup: "SUDO",
  },
];

export default institionsRoute;
