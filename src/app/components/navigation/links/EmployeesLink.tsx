import { FC } from "react";
import SidebarDropdownLink from "../SidebarDropdownLink";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import { Permission } from "../../../constants/permissions";
import SidebarLink from "../SidebarLink";

type props = {
  managerPermissions: string[];
};

type linkProps = {
  to: string;
  label: string;
  permissions?: Permission[];
};

const UsersLink: FC<props> = ({ managerPermissions }) => {
  let linkTo: string = "";
  const links: linkProps[] = [];

  if (managerPermissions.includes("HR")) {
    linkTo = "/Users";
    links.push({ label: "All Users", to: "Users" });
  }
  if (managerPermissions.includes("FOREMAN")) {
    linkTo = "/Users/drivers";
    links.push({ label: "Drivers", to: "Users/drivers" });
  }
  if (managerPermissions.includes("HEAD_OF_GARAGE")) {
    linkTo = "/Users/mechanicians";
    links.push({ label: "Mechanicians", to: "Users/mechanicians" });
  }

  return (
    <>
      {managerPermissions.length == 1 && (
        <SidebarLink
          text={linkTo.split("/").pop() as string}
          Icon={<UserGroupIcon className='w-5 stroke-2 text-darkblue' />}
          to={linkTo}
        />
      )}
      {managerPermissions.length > 1 && (
        <>
          <SidebarDropdownLink
            text={"Users"}
            to='/Users'
            Icon={<UserGroupIcon className='w-5 stroke-2 text-darkblue' />}
            links={links}
          />
        </>
      )}
    </>
  );
};

export default UsersLink;
