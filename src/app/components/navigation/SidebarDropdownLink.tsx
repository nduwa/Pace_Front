import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Fragment, PropsWithChildren, ReactElement } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Permission } from "../../constants/permissions";
import Protected from "../auth/Protected";

export type IDropdownLink = {
  to: string;
  label: string;
  permissions?: Permission[];
};
export interface SidebarLinkProps {
  text: string;
  to: string;
  Icon: ReactElement;
  links: IDropdownLink[];
}

const SidebarDropdownLink = (props: PropsWithChildren<SidebarLinkProps>) => {
  const { Icon, text, to, links } = props;
  const location = useLocation();

  const activeWhen = links.map((link) => link.to);
  const isActive = (activeWhen || [to]).some((link) => location.pathname === link);

  if (isActive)
    return (
      <div className='flex justify-center mt-2 relative group'>
        <div className={`relative w-full rounded-md data-[open]:${isActive}`}>
          <div>
            <div
              className={`w-full flex p-2 text-gray-100 hover:text-white ${
                isActive ? "bg-gray-100 bg-opacity-10 text-white" : ""
              } hover:bg-gray-100 hover:bg-opacity-10 rounded-md space-5 items-center justify-between`}
            >
              <div className='flex w-full space-5'>
                {Icon}
                <div className='text-md font-medium ml-4'>{text}</div>
              </div>
            </div>
          </div>

          <div className='w-full pl-9 mt-1' data-open={true}>
            {props.links.map((link, index) => (
              <Protected key={index} permissions={link.permissions ?? []}>
                <div>
                  <NavLink
                    to={link.to}
                    className={`w-full flex px-2 py-1 ${
                      location.pathname == link.to
                        ? "text-white underline"
                        : "text-gray-300"
                    } hover:text-white rounded-md space-5 items-center`}
                  >
                    <div className='text-sm font-medium'>{link.label}</div>
                  </NavLink>
                </div>
              </Protected>
            ))}
          </div>
        </div>
      </div>
    );

  return (
    <div className='flex justify-center mt-2 relative group'>
      <Menu as='div' className={`relative w-full rounded-m`}>
        <div>
          <Menu.Button
            className={`w-full flex p-2 text-gray-100 hover:text-white ${
              isActive ? "bg-gray-100 bg-opacity-10 text-white" : ""
            } hover:bg-gray-100 hover:bg-opacity-10 rounded-md space-5 items-center justify-between`}
          >
            <div className='flex w-full space-5'>
              {Icon}
              <div className='text-md font-medium ml-4'>{text}</div>
            </div>
            <ChevronDownIcon
              className='h-4 w-4 flex-shrink-0 text-gray-400 lg:block'
              aria-hidden='true'
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items className='w-full pl-9 mt-1' data-open={true}>
            {props.links.map((link, index) => (
              <Protected key={index} permissions={link.permissions ?? []}>
                <Menu.Item>
                  {({ active }) => (
                    <NavLink
                      to={link.to}
                      className={`w-full flex px-2 py-1 ${
                        active ? "text-white" : "text-gray-300"
                      } hover:text-white rounded-md space-5 items-center`}
                    >
                      <div className='text-sm font-medium'>{link.label}</div>
                    </NavLink>
                  )}
                </Menu.Item>
              </Protected>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default SidebarDropdownLink;
