import { createBrowserRouter, RouterProvider } from "react-router-dom";
import GuestLayout from "../../components/layouts/GuestLayout";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import routes from "../../routes/routes";
import AuthGuard from "../../components/auth/AuthGuard";
import { IRoute } from "../../types/common";
import Login from "../../pages/auth/Login";
import ForgotPasswordPage from "../../pages/auth/ForgotPassword";
import ResetPasswordPage from "../../pages/auth/ResetPassword";
import ProfilePage from "../../pages/profile/ProfilePage";

const RoutesProvider = () => {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <GuestLayout />,
      children: [
        {
          path: "",
          element: <Login />,
        },
      ],
    },
    {
      path: "/forgot-password",
      element: <GuestLayout />,
      children: [
        {
          path: "",
          element: <ForgotPasswordPage />,
        },
      ],
    },
    {
      path: "/reset-password",
      element: <GuestLayout />,
      children: [
        {
          path: "",
          element: <ResetPasswordPage />,
        },
      ],
    },
    {
      path: "/profile",
      element: <DashboardLayout />,
      children: [
        {
          path: "",
          element: <ProfilePage />,
        },
      ],
    },
    {
      path: "/",
      element: <DashboardLayout />,
      children: [
        ...routes.map((route: IRoute) => ({
          path: route.path,
          element: route.allowedPermissionGroup ? (
            <AuthGuard
              requiredGroup={route.allowedPermissionGroup}
              requiredPermissions={route.allowedPermissions}
              superAdmin={route.superAdmin}
            >
              <route.element />
            </AuthGuard>
          ) : (
            <route.element />
          ),
        })),
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default RoutesProvider;
