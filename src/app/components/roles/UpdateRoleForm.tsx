import { useMutation, useQueryClient } from "@tanstack/react-query";
import TextField from "../common/form/TextField";
import UpdateRolePermissionGroup from "./UpdateRolePermissionGroup";
import { ALL_ROLES, ROLE } from "../../utils/constants/queryKeys";
import { updateRole } from "../../apis/roles";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roleSchema } from "../../utils/schemas/roles.schema";
import Button from "../common/form/Button";
import toast from "react-hot-toast";
import { Dispatch, FC, SetStateAction } from "react";
import {
  IPermission,
  IPermissionsGroup,
  IRole,
  IRoleRequest,
} from "../../types/common";

interface IUpdateRoleForm {
  role: IRole;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  permissionWithGroup: IPermissionsGroup[];
  allPermissions: IPermission[];
  rolePermissions: string[];
}
const UpdateRoleForm: FC<IUpdateRoleForm> = ({
  role,
  setIsOpen,
  permissionWithGroup,
  allPermissions,
  rolePermissions,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRoleRequest>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      label: role?.label,
      permissions: rolePermissions,
    },
  });
  const queryClient = useQueryClient();

  const rolePermissionLabels = role.permissions.map((role) => role.label);
  const sortPermissionsGroups = (
    permissionsArray: IPermissionsGroup[],
    rolePermissionsLabels: string[],
  ) => {
    return permissionsArray.sort((a: IPermissionsGroup, b: IPermissionsGroup) => {
      const countA = a.permissions.filter((permission) =>
        rolePermissionsLabels.includes(permission),
      ).length;
      const countB = b.permissions.filter((permission) =>
        rolePermissionsLabels.includes(permission),
      ).length;

      return countB - countA; // Sort in descending order based on the count
    });
  };

  const sortedPermissionGroups = sortPermissionsGroups(
    permissionWithGroup,
    rolePermissionLabels,
  );

  const updateRoleMutation = useMutation(updateRole);

  const handleRoleCreation = (data: IRoleRequest) => {
    updateRoleMutation.mutate(
      { role: data, id: role.id },
      {
        onSuccess() {
          toast.success("Role updated!");
          queryClient.invalidateQueries(ALL_ROLES);
          queryClient.invalidateQueries(ROLE);
          setIsOpen && setIsOpen(false);
        },
      },
    );
  };

  return (
    <>
      {allPermissions && permissionWithGroup && (
        <form className=' space-y-4' onSubmit={handleSubmit(handleRoleCreation)}>
          <div className='grid gap-4'>
            <TextField
              label='Role'
              type='text'
              error={errors.label?.message}
              register={register("label")}
            />
          </div>

          {errors.permissions?.message && (
            <div className='text-red-500 bg-red-200 font-medium p-3 rounded'>
              {errors.permissions.message}
            </div>
          )}
          <div className='w-full'>
            {sortedPermissionGroups
              ?.filter((item) => item.group != "SUDO" && item.group != "Companies")
              .map((permissionGroup) => (
                <UpdateRolePermissionGroup
                  key={permissionGroup.group}
                  permissions={allPermissions!}
                  rolePermissions={role.permissions}
                  group={permissionGroup}
                  register={register("permissions")}
                />
              ))}
          </div>
          <Button isLoading={updateRoleMutation.isLoading} label='Save' />
        </form>
      )}
    </>
  );
};

export default UpdateRoleForm;
