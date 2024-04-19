import DrugsCategoriesPage from "../pages/drugs/DrugCategories";
import DrugPurchaseForm from "../pages/drugs/DrugPurchaseForm";
import DrugPurchases from "../pages/drugs/DrugPurchases";
import DrugsPage from "../pages/drugs/DrugsPage";
import PurchaseDetailsPage from "../pages/drugs/PurchaseDetails";
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
    path: "/drugs/purchases",
    element: DrugPurchases,
    allowedPermissionGroup: "MEDECINES",
  },
  {
    path: "/drugs/categories",
    element: DrugsCategoriesPage,
    allowedPermissionGroup: "MEDECINES",
  },
  {
    path: "/drugs/purchases/add",
    element: DrugPurchaseForm,
    allowedPermissionGroup: "MEDECINES",
  },
  {
    path: "/drugs/purchases/:id",
    element: PurchaseDetailsPage,
    allowedPermissionGroup: "MEDECINES",
  },
];

export default drugsRoutes;
