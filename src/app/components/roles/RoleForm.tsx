import { useMutation, useQuery } from "@tanstack/react-query";
import TextField from "../../components/common/form/TextField";
import PermissionGroup from "../../components/roles/PermissionGroup";
import {
  ALL_APP_PERMISSIONS,
  ALL_GROUPED_PERMISSIONS,
} from "../../utils/constants/queryKeys";
import {
  getGroupedPermissions,
  getAppPermissions,
  createRole,
} from "../../apis/roles";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roleSchema } from "../../utils/schemas/roles.schema";
import Button from "../../components/common/form/Button";
import toast from "react-hot-toast";
import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { IRoleRequest } from "../../types/common";

interface IRoleFrom {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}
const RoleForm: FC<IRoleFrom> = ({ setIsLoading }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IRoleRequest>({
    resolver: zodResolver(roleSchema),
  });

  const { data: permissionWithGroup } = useQuery({
    queryKey: ALL_GROUPED_PERMISSIONS,
    queryFn: getGroupedPermissions,
  });
  const { data: allPermissions } = useQuery({
    queryKey: ALL_APP_PERMISSIONS,
    queryFn: getAppPermissions,
  });
  const createRoleMutatation = useMutation(createRole);

  const handleRoleCreation = (data: IRoleRequest) => {
    createRoleMutatation.mutate(data, {
      onSuccess() {
        toast.success("Role created!");
        reset();
      },
    });
  };

  useEffect(() => {
    if (permissionWithGroup && allPermissions) {
      setIsLoading(false);
    }
  }, [permissionWithGroup, allPermissions, setIsLoading]);
  return (
    <>
      {allPermissions && permissionWithGroup && (
        <form className=' space-y-4' onSubmit={handleSubmit(handleRoleCreation)}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {permissionWithGroup
              ?.filter((item) => item.group != "SUDO" && item.group != "Companies")
              .map((permissionGroup) => (
                <PermissionGroup
                  key={permissionGroup.group}
                  permissions={allPermissions!}
                  group={permissionGroup}
                  register={register("permissions")}
                />
              ))}
          </div>
          <Button isLoading={createRoleMutatation.isLoading} label='Save' />
        </form>
      )}
    </>
  );
};

export default RoleForm;
