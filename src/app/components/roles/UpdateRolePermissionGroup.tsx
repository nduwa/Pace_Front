import { FC } from "react";
import { IPermission, IPermissionsGroup } from "../../types/common";
import Checkbox from "../common/form/Checkbox";
import { UseFormRegisterReturn } from "react-hook-form";
import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

interface IPermissionGroupProps {
  group: IPermissionsGroup;
  permissions: IPermission[];
  rolePermissions: Partial<IPermission>[] | undefined;
  rolePermissionIds?: string | undefined[];
  register?: UseFormRegisterReturn;
}
const PermissionGroup: FC<IPermissionGroupProps> = ({
  group,
  permissions,
  rolePermissions = [],
  register,
}) => {
  const groupPermissionCount = group.permissions.length;

  const groupPermissionLabels = group.permissions.filter((item) =>
    rolePermissions?.some((rolePermission) => rolePermission.label === item),
  );
  const rolePermissionCount = groupPermissionLabels.length;

  return (
    <div className={`permission-group-div group-${group.group}`}>
      <Disclosure
        as='div'
        className='bg-gray-100 rounded-sm'
        {...(rolePermissionCount ? { defaultOpen: true } : {})}
      >
        {({ open }) => (
          <>
            <Disclosure.Button className='flex w-full justify-between rounded-sm bg-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500/75 mt-2'>
              <div className='flex space-x-3'>
                <span>
                  {group.group}{" "}
                  <span className='total-selected'>{rolePermissionCount}</span>/
                  {groupPermissionCount} permissions
                </span>
              </div>

              <ChevronDownIcon
                className={`${
                  open ? "rotate-180 transform" : ""
                } h-5 w-5 text-gray-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className='px-4 pt-4 pb-2 text-sm text-gray-500 space-y-1'>
              {group.permissions.map((permission) => {
                const label = permission
                  .split("_")
                  .join(" ")
                  .split(group.group.toUpperCase())
                  .join(" ");
                const id = permissions.find((item) => item.label === permission)?.id;
                return (
                  <Checkbox
                    key={label}
                    value={id}
                    label={label}
                    register={register as UseFormRegisterReturn}
                  />
                );
              })}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default PermissionGroup;
