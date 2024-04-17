import DrugPurchaseForm from "../pages/drugs/DrugPurchaseForm";
import DrugPurchases from "../pages/drugs/DrugPurchases";
import DrugsPage from "../pages/drugs/DrugsPage";
import PurchaseDetailsPage from "../pages/drugs/PurchaseDetails";
import { IRoute } from "../types/common";

const drugsRoutes: IRoute[] = [
  {
    path: "drugs",
    element: DrugsPage,
    allowedPermissionGroup: "MEDECINES",
  },
  {
    path: "/drugs/purchases",
    element: DrugPurchases,
  },
  {
    path: "/drugs/purchases/add",
    element: DrugPurchaseForm,
  },
  {
    path: "/drugs/purchases/:id",
    element: PurchaseDetailsPage,
  },
];

export default drugsRoutes;
