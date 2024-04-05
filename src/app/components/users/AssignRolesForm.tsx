import { useMutation, useQueryClient } from "@tanstack/react-query";
import { USERS } from "../../utils/constants/queryKeys";
import { assignPermissions } from "../../apis/users";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  assignPermissionsSchema,
  assignPermissionsSchemaType,
} from "../../utils/schemas/users.schema";
import Button from "../../components/common/form/Button";
import toast from "react-hot-toast";
import { Dispatch, FC, SetStateAction } from "react";
import {
  IAssignPermissionsRequest,
  IRole,
  IUserWithPermissions,
} from "../../types/common";
import RolePermissions from "../roles/RolePermissions";
import Checkbox from "../common/form/Checkbox";

interface IAssignRolesForm {
  roles: IRole[];
  user: IUserWithPermissions;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
const AssignRolesForm: FC<IAssignRolesForm> = ({ user, setIsOpen, roles }) => {
  const userRoles = (user?.roles.map((obj) => obj.id) || []) as string[];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<assignPermissionsSchemaType>({
    resolver: zodResolver(assignPermissionsSchema),
    defaultValues: {
      roles: userRoles,
    },
  });
  const queryClient = useQueryClient();
  const assignPermissionsMutation = useMutation(assignPermissions);
  const handleAssignPermissions = (data: IAssignPermissionsRequest) => {
    assignPermissionsMutation.mutate(
      { ...data, id: user.id },
      {
        onSuccess() {
          toast.success("Roles saved");
          queryClient.invalidateQueries(USERS);
          reset();
          setIsOpen(false);
        },
      },
    );
  };

  return (
    <>
      {user && roles && (
        <form
          className=' space-y-4'
          onSubmit={handleSubmit(handleAssignPermissions)}
        >
          {errors.roles?.message && (
            <div className='text-red-500 bg-red-200 font-medium p-3 rounded'>
              {errors.roles.message}
            </div>
          )}
          <div className='w-full mt-3 table'>
            {roles?.map((role) => (
              <div className='table-row w-full' key={role.id}>
                <div className='table-cell'>
                  <Checkbox
                    key={role.id}
                    value={role.id}
                    register={register("roles")}
                  />
                </div>
                <div className='table-cell'>
                  <RolePermissions
                    role={role}
                    checkedPermissions={
                      user.permissions.map((permission) => permission.label || "") ||
                      []
                    }
                  />
                </div>
              </div>
            ))}
          </div>
          <Button isLoading={assignPermissionsMutation.isLoading} label='Save' />
        </form>
      )}
    </>
  );
};

export default AssignRolesForm;
