import InvoiceDetailsPage from "../pages/invoices/InvoiceDetails";
import InvoiceFormPage from "../pages/invoices/InvoiceFormPage";
import DrugInvoices from "../pages/invoices/InvoicesPage";
import { IRoute } from "../types/common";

const invoicessRoutes: IRoute[] = [
  {
    path: "invoices",
    element: DrugInvoices,
    allowedPermissions: ["SERVE_MEDECINES", "VIEW_INVOICES"],
  },
  {
    path: "serve-medecines",
    element: InvoiceFormPage,
    allowedPermissions: ["SERVE_MEDECINE"],
  },
  {
    path: "/invoices/:id",
    element: InvoiceDetailsPage,
    allowedPermissions: ["SERVE_MEDECINES", "VIEW_INVOICES", "VIEW_PATIENTS"],
  },
];

export default invoicessRoutes;
