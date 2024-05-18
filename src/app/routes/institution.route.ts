import BranchesPage from "../pages/institution/Branches";
import InstitutionsPage from "../pages/institution/InstitutionsPage";
import { IRoute } from "../types/common";

const institionsRoute: IRoute[] = [
  {
    path: "institutions",
    element: InstitutionsPage,
    allowedPermissionGroup: "SUDO",
  },
  {
    path: "branches",
    element: BranchesPage,
    allowedPermissions: ["INSTITUTION_ADMIN"],
  },
];

export default institionsRoute;
