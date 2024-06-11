import FormDetailsPage from "../pages/forms/FormDetailsPage";
import FormFormPage from "../pages/forms/FormFormPage";
import FormsLocationPage from "../pages/forms/FormsLocationPage";
import FormsPage from "../pages/forms/FormsPage";
import { IRoute } from "../types/common";

const formsRoutes: IRoute[] = [
  {
    path: "forms",
    element: FormsPage,
    allowedPermissionGroup: "CLINIC",
  },
  {
    path: "forms/new",
    element: FormFormPage,
    allowedPermissionGroup: "CLINIC",
  },
  {
    path: "/forms/:location",
    element: FormsLocationPage,
    allowedPermissionGroup: "CLINIC",
  },

  {
    path: "/forms/:id/view",
    element: FormDetailsPage,
    allowedPermissionGroup: "CLINIC",
  },
];

export default formsRoutes;
