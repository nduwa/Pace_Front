import {
  BeakerIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  CurrencyDollarIcon,
  DocumentCheckIcon,
  EyeDropperIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  Square3Stack3DIcon,
  UsersIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import SidebarLink from "./SidebarLink";
import ToggleSidebar from "../../helpers/ToggleSidebar";
import logo from "../../assets/logo-color.png";
import { HasPermissionGroup } from "../../helpers/HasPermissionGroup";
import SidebarDropdownLink, { IDropdownLink } from "./SidebarDropdownLink";
import Protected from "../auth/Protected";
import { HasPermission } from "../../helpers/HasPermission";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/Auth";
import { useQuery } from "@tanstack/react-query";
import { FORMS_LOCATIONS } from "../../utils/constants/queryKeys";
import { getLocations } from "../../apis/forms";
import { Permission } from "../../constants/permissions";

const Sidebar = () => {
  const isSudo = HasPermission(["ALL_PERMISSIONS"], true);
  const user = useContext(AuthContext)?.userProfile;

  const { data: locations } = useQuery({
    queryKey: FORMS_LOCATIONS,
    queryFn: getLocations,
  });

  const [formLinks, setFormLinks] = useState<IDropdownLink[]>();

  const [manageLinks, setManageLinks] = useState<IDropdownLink[]>();

  useEffect(() => {
    if (!formLinks && locations !== undefined) {
      setFormLinks(
        locations.map((loc) => {
          let permission: Permission[] = ["RECEIPTION"];
          if (loc === "COUNTER") permission.push("COUNTER");
          else if (loc === "PHARMACY") permission.push("PHARMACY");
          else if (loc === "LABORATORY") permission.push("LABORATORY");
          else if (loc === "ARCHIVE") {
          } else {
            permission.push("CONSULTATION");
          }
          return {
            to: `/forms/${loc}`,
            label: loc,
            permissions: permission,
          };
        }),
      );
    }
  }, [locations]);

  useEffect(() => {
    if (manageLinks === undefined && user) {
      let links: IDropdownLink[] = [];
      if (user && user.institution?.institutionType == "CLINIC") {
        links.push({ label: "Consultations", to: "/consultations" });
      }
      if (user && user.institution?.institutionId == null) {
        links.push({ label: "Branches", to: "/branches" });
      }
      links.push({
        label: "Roles",
        to: "/roles",
      });
      links.push({
        label: "Settings",
        to: "/settings",
      });

      setManageLinks(links);
    }
  }, [user]);

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

            {HasPermissionGroup("TRANSACTIONS") && (
              <SidebarLink
                text='Transactions'
                to='/transactions'
                Icon={<CurrencyDollarIcon className='w-5 stroke-2 text-white' />}
              />
            )}

            {HasPermissionGroup("EXAMS") && (
              <SidebarLink
                text='Exams'
                to='/exams'
                Icon={<BeakerIcon className='w-5 stroke-2 text-white' />}
              />
            )}

            <Protected permissions={["VIEW_MEDECINES"]}>
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
            </Protected>

            {!isSudo && (
              <>
                <Protected permissions={["VIEW_MEDECINES", "PURCHASE_MEDECINES"]}>
                  <SidebarDropdownLink
                    text='Drugs Stock'
                    to='/stock'
                    Icon={<Square3Stack3DIcon className='w-5 stroke-2 text-white' />}
                    links={[
                      {
                        label: "In stock",
                        to: "/stock",
                        permissions: ["VIEW_MEDECINES"],
                      },
                      {
                        label: "Purchases",
                        to: "/drugs/purchases",
                        permissions: ["PURCHASE_MEDECINES"],
                      },
                      {
                        label: "Orders",
                        to: "/drugs/orders",
                        permissions: ["PURCHASE_MEDECINES"],
                      },
                      {
                        label: "Add order",
                        to: "/drugs/orders/add",
                        permissions: ["PURCHASE_MEDECINES"],
                      },
                    ]}
                  />
                </Protected>

                {HasPermissionGroup("CLINIC") &&
                  user?.institution !== null &&
                  user?.institution.institutionType === "CLINIC" && (
                    <SidebarDropdownLink
                      text='Forms'
                      to='/forms'
                      Icon={
                        <DocumentCheckIcon className='w-5 stroke-2 text-white' />
                      }
                      links={[
                        {
                          to: "forms",
                          label: "All forms",
                        },
                        {
                          to: "forms/new",
                          label: "New form",
                          permissions: ["RECEIPTION"],
                        },
                        ...(formLinks ? formLinks : []),
                      ]}
                    />
                  )}

                {HasPermission(["INSTITUTION_ADMIN"]) && (
                  <SidebarDropdownLink
                    text='Manage'
                    to='/roles'
                    Icon={
                      <BuildingOffice2Icon className='w-5 stroke-2 text-white' />
                    }
                    links={[...(manageLinks ? manageLinks : [])]}
                  />
                )}

                {HasPermissionGroup("INVOICES") && (
                  <SidebarLink
                    text='Invoices'
                    to='/invoices'
                    Icon={<DocumentCheckIcon className='w-5 stroke-2 text-white' />}
                  />
                )}
              </>
            )}

            {user?.institution && user.institution.institutionType == "PHARMACY" && (
              <>
                {HasPermission(["SERVE_MEDECINES"]) && (
                  <SidebarLink
                    text='Serve Medecine'
                    to='/serve-medecines'
                    Icon={<ShoppingCartIcon className='w-5 stroke-2 text-white' />}
                  />
                )}
              </>
            )}

            {HasPermissionGroup("SUDO", true) && (
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
