import { FC } from "react";
import { IPermission, IPermissionsGroup } from "../../types/common";
import Checkbox from "../common/form/Checkbox";
import { UseFormRegisterReturn } from "react-hook-form";

interface IPermissionGroupProps {
  group: IPermissionsGroup;
  permissions: IPermission[];
  register?: UseFormRegisterReturn;
}
const PermissionGroup: FC<IPermissionGroupProps> = ({
  group,
  permissions,
  register,
}) => {
  return (
    <div>
      <div className='bg-gray-100 p-3 rounded-sm'>{group.group}</div>
      <div className='bg-gray-50 p-3 space-y-1'>
        {group.permissions.map((permission) => {
          const label = permission
            .split("_")
            .map(
              (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
            )
            .join(" ")
            .replace(new RegExp(group.group.toUpperCase(), "g"), "");
          return (
            <Checkbox
              key={label}
              value={permissions.find((item) => item.label === permission)?.id}
              label={label}
              register={register as UseFormRegisterReturn}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PermissionGroup;
