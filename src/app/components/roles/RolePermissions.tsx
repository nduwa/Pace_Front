import { FC } from "react";
import { IRole } from "../../types/common";
import { Disclosure } from "@headlessui/react";
import { CheckCircleIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

interface IRolePermissionsProps {
  role: IRole;
  checkedPermissions?: string[];
}
const RolePermissions: FC<IRolePermissionsProps> = ({
  role,
  checkedPermissions = [],
}) => {
  return (
    <div className='w-full'>
      <Disclosure as='div' className='bg-gray-100 rounded-sm'>
        {({ open }) => (
          <>
            <Disclosure.Button className='flex w-full justify-between rounded-sm bg-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500/75 mt-2'>
              <div className='flex space-x-3'>
                <span>{role.label}</span>
              </div>

              <ChevronDownIcon
                className={`${
                  open ? "rotate-180 transform" : ""
                } h-5 w-5 text-gray-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className='px-4 pt-4 pb-2 text-sm text-gray-500 space-y-1'>
              {role.permissions.map((permission) => {
                const label = permission.label
                  .split("_")
                  .map(
                    (word) =>
                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
                  )
                  .join(" ")
                  .replace(new RegExp(permission.label.toUpperCase(), "g"), "");
                return (
                  <div key={label} className='flex items-start space-x-2'>
                    <div className=''>{label}</div>
                    {checkedPermissions.includes(permission.label) && (
                      <CheckCircleIcon className='w-4 text-green-500' />
                    )}
                  </div>
                );
              })}

              {role.permissions.length == 0 && <p>No permission yet</p>}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default RolePermissions;
