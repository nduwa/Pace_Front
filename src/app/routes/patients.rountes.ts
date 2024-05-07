import PatientsPage from "../pages/patients/PatientsPage";
import { IRoute } from "../types/common";

const patientsRoutes: IRoute[] = [
  {
    path: "patients",
    element: PatientsPage,
    allowedPermissionGroup: "PATIENTS",
  },
];

export default patientsRoutes;
