import InvoiceDetailsPage from "../pages/invoices/InvoiceDetails";
import InvoiceFormPage from "../pages/invoices/InvoiceFormPage";
import DrugInvoices from "../pages/invoices/InvoicesPage";
import { IRoute } from "../types/common";

const invoicessRoutes: IRoute[] = [
  {
    path: "invoices",
    element: DrugInvoices,
    allowedPermissionGroup: ["MEDECINES"],
  },
  {
    path: "invoices/add",
    element: InvoiceFormPage,
    allowedPermissions: ["SERVE_MEDECINE"],
  },
  {
    path: "/invoices/:id",
    element: InvoiceDetailsPage,
    allowedPermissionGroup: "SERVE_MEDECINE",
  },
];

export default invoicessRoutes;
