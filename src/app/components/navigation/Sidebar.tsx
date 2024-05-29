import {
  BuildingOffice2Icon,
  ChartBarIcon,
  CurrencyDollarIcon,
  EyeDropperIcon,
  FolderOpenIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  UsersIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import SidebarLink from "./SidebarLink";
import ToggleSidebar from "../../helpers/ToggleSidebar";
import logo from "../../assets/logo-color.png";
import { HasPermissionGroup } from "../../helpers/HasPermissionGroup";
import SidebarDropdownLink from "./SidebarDropdownLink";
import Protected from "../auth/Protected";
import { HasPermission } from "../../helpers/HasPermission";
import { HasPermissions } from "../../helpers/HasPermissions";
import { useContext } from "react";
import { AuthContext } from "../../context/Auth";

const Sidebar = () => {
  const isSudo = HasPermission(["ALL_PERMISSIONS"], true);
  const user = useContext(AuthContext)?.userProfile;
  return (
    <div className='min-h-screen'>
      <div className='sidebar w-60 flex overflow-x-clip flex-col h-full justify-between border shadow duration-300 z-10 sidebar fixed top-0 bottom-0 left-[-300px] md:left-0 bg-darkblue'>
        <div className='flex min-h-screen flex-col justify-between items-center pt-2 pb-6 w-full h-full'>
          <div className='px-4 flex items-center justify-between mb-8 md:justify-center w-full'>
            <img src={logo} alt='DigitalMed Logo' className='w-12 h-auto' />
            <button onClick={() => ToggleSidebar()} className='md:hidden'>
              <XCircleIcon className='w-6 text-white' />
            </button>
          </div>
          <div className='py-2 h-full overflow-y-auto w-full px-4'>
            <SidebarLink
              text='Dashboard'
              to='/'
              Icon={<ChartBarIcon className='w-5 stroke-2 text-white' />}
            />

            {HasPermissionGroup("USERS") && (
              <SidebarLink
                text='Users'
                to='/users'
                Icon={<UsersIcon className='w-5 stroke-2 text-white' />}
              />
            )}

            {HasPermissionGroup("PATIENTS") && (
              <SidebarLink
                text='Patients'
                to='/patients'
                Icon={<UsersIcon className='w-5 stroke-2 text-white' />}
              />
            )}

            {HasPermissionGroup("INSTITUTIONS", true) && (
              <SidebarLink
                text='Institutions'
                to='/institutions'
                Icon={<BuildingOffice2Icon className='w-5 stroke-2 text-white' />}
              />
            )}

            <SidebarLink
              text='Transactions'
              to='/transactions'
              Icon={<CurrencyDollarIcon className='w-5 stroke-2 text-white' />}
            />
            {isSudo && (
              <SidebarDropdownLink
                text='Drugs'
                to='/drugs'
                Icon={<EyeDropperIcon className='w-5 stroke-2 text-white' />}
                links={[
                  {
                    label: "Drugs",
                    to: "/drugs",
                    permissions: ["VIEW_MEDECINES"],
                  },
                  {
                    label: "Categories",
                    to: "/drugs/categories",
                    permissions: ["VIEW_MEDECINES"],
                  },
                ]}
              />
            )}

            {!isSudo && (
              <>
                <Protected permissions={["INSTITUTION_ADMIN"]}>
                  {user && user.institution?.institutionId == null && (
                    <SidebarLink
                      text='Branches'
                      to='/branches'
                      Icon={<FolderOpenIcon className='w-5 stroke-2 text-white' />}
                    />
                  )}
                </Protected>
                <Protected permissions={["VIEW_MEDECINES", "PURCHASE_MEDECINES"]}>
                  <SidebarDropdownLink
                    text='Drugs'
                    to='/drugs'
                    Icon={<EyeDropperIcon className='w-5 stroke-2 text-white' />}
                    links={[
                      {
                        label: "Drugs",
                        to: "/drugs",
                        permissions: ["VIEW_MEDECINES"],
                      },
                      {
                        label: "In stock",
                        to: "/stock",
                        permissions: ["VIEW_MEDECINES"],
                      },
                      {
                        label: "Orders",
                        to: "/drugs/orders",
                        permissions: ["PURCHASE_MEDECINES"],
                      },
                      {
                        label: "Purchases",
                        to: "/drugs/purchases",
                        permissions: ["PURCHASE_MEDECINES"],
                      },
                      {
                        label: "Add order",
                        to: "/drugs/orders/add",
                        permissions: ["PURCHASE_MEDECINES"],
                      },
                      {
                        label: "Categories",
                        to: "/drugs/categories",
                        permissions: ["VIEW_MEDECINES"],
                      },
                    ]}
                  />
                </Protected>
              </>
            )}

            {HasPermissions(["SERVE_MEDECINES"]) && (
              <SidebarDropdownLink
                text='Sell drugs'
                to='/invoices'
                Icon={<ShoppingCartIcon className='w-5 stroke-2 text-white' />}
                links={[
                  {
                    label: "Invoices",
                    to: "/invoices",
                    permissions: ["SERVE_MEDECINES"],
                  },
                  {
                    label: "New Invoice",
                    to: "/invoices/add",
                    permissions: ["SERVE_MEDECINES"],
                  },
                ]}
              />
            )}
            {HasPermissionGroup("ADMIN") && (
              <SidebarLink
                text='Roles'
                to='/roles'
                Icon={<ShieldCheckIcon className='w-5 stroke-2 text-white' />}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
