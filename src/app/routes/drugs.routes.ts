import DrugsCategoriesPage from "../pages/drugs/DrugCategories";
import DrugPurchaseForm from "../pages/drugs/DrugPurchaseForm";
import DrugPurchases from "../pages/drugs/DrugPurchases";
import DrugsPage from "../pages/drugs/DrugsPage";
import InstitutionDrugsPage from "../pages/drugs/InstitutionDrugsPage";
import PurchaseDetailsPage from "../pages/drugs/PurchaseDetails";
import PurchaseHistory from "../pages/drugs/PurchaseHistory";
import UpdatePurchasePage from "../pages/drugs/UpdatePurchasePage";
import TransactionsPage from "../pages/transactions/TransactionsPage";
import { IRoute } from "../types/common";

const drugsRoutes: IRoute[] = [
  {
    path: "transactions",
    element: TransactionsPage,
  },
  {
    path: "drugs",
    element: DrugsPage,
    allowedPermissionGroup: "MEDECINES",
  },
  {
    path: "stock",
    element: InstitutionDrugsPage,
    allowedPermissionGroup: "MEDECINES",
  },
  {
    path: "/drugs/orders",
    element: DrugPurchases,
    allowedPermissionGroup: "MEDECINES",
  },
  {
    path: "/drugs/categories",
    element: DrugsCategoriesPage,
    allowedPermissionGroup: "MEDECINES",
  },
  {
    path: "/drugs/orders/add",
    element: DrugPurchaseForm,
    allowedPermissionGroup: "MEDECINES",
  },
  {
    path: "/drugs/purchases",
    element: PurchaseHistory,
    allowedPermissionGroup: "MEDECINES",
  },
  {
    path: "/drugs/orders/:id",
    element: PurchaseDetailsPage,
    allowedPermissionGroup: "MEDECINES",
  },

  {
    path: "/drugs/orders/:id/update",
    element: UpdatePurchasePage,
    allowedPermissionGroup: "MEDECINES",
  },
];

export default drugsRoutes;
