import ConsultationsPage from "../pages/consultations/ConsultationsPage";
import BranchesPage from "../pages/institution/Branches";
import InstitutionsPage from "../pages/institution/InstitutionsPage";
import SettingPage from "../pages/institution/SettingPage";
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
    allowedPermissionGroup: ["ADMIN"],
  },

  {
    path: "consultations",
    element: ConsultationsPage,
    allowedPermissionGroup: ["ADMIN"],
  },

  {
    path: "settings",
    element: SettingPage,
    allowedPermissionGroup: ["ADMIN"],
  },
];

export default institionsRoute;
