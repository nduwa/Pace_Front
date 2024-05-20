import PatientInvoices from "../pages/invoices/PatientInvoicesPage";
import PatientsPage from "../pages/patients/PatientsPage";
import { IRoute } from "../types/common";

const patientsRoutes: IRoute[] = [
  {
    path: "patients",
    element: PatientsPage,
    allowedPermissionGroup: "PATIENTS",
  },
  {
    path: "/patients/:id/invoices",
    element: PatientInvoices,
    allowedPermissionGroup: "PATIENTS",
  },
];

export default patientsRoutes;
