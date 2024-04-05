import { FC } from "react";
import { IPermission, IPermissionsGroup } from "../../types/common";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

interface IRolePermissionGroupProps {
  group: IPermissionsGroup;
  permissions: IPermission[];
}
const RolePermissionGroup: FC<IRolePermissionGroupProps> = ({
  group,
  permissions,
}) => {
  const filteredPermissions = permissions.filter((permission) =>
    group.permissions.includes(permission.label),
  );
  if (filteredPermissions.length == 0) {
    return <></>;
  } else {
    return (
      <div>
        <Disclosure as='div' className='bg-gray-100 rounded-sm'>
          {({ open }) => (
            <>
              <Disclosure.Button className='flex w-full justify-between rounded-sm bg-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500/75 mt-2'>
                <div className='flex space-x-3'>
                  <span>{group.group}</span>
                </div>

                <ChevronDownIcon
                  className={`${
                    open ? "rotate-180 transform" : ""
                  } h-5 w-5 text-gray-500`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className='px-4 pt-4 pb-2 text-sm text-gray-500 space-y-1'>
                {filteredPermissions.map((permission) => {
                  const label = permission.label
                    .split("_")
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
                    )
                    .join(" ")
                    .replace(new RegExp(group.group.toUpperCase(), "g"), "");
                  return <div key={label}>{label}</div>;
                })}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    );
  }
};

export default RolePermissionGroup;
