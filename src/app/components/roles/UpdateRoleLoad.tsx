import { useQuery } from "@tanstack/react-query";
import {
  ALL_APP_PERMISSIONS,
  ALL_GROUPED_PERMISSIONS,
  ROLE,
} from "../../utils/constants/queryKeys";
import { getGroupedPermissions, getAppPermissions, getRole } from "../../apis/roles";

import { Dispatch, FC, SetStateAction } from "react";
import { SyncLoader } from "react-spinners";
import UpdateRoleForm from "./UpdateRoleForm";

interface IUpdateRoleLoad {
  roleId: string;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}
const UpdateRoleLoad: FC<IUpdateRoleLoad> = ({ roleId, setIsOpen }) => {
  const { isFetching, data: role } = useQuery({
    queryFn: () => getRole(roleId),
    queryKey: ROLE,
  });

  const { data: permissionWithGroup, isLoading: groupLoading } = useQuery({
    queryKey: ALL_GROUPED_PERMISSIONS,
    queryFn: getGroupedPermissions,
  });
  const { data: allPermissions, isLoading: permissionLoading } = useQuery({
    queryKey: ALL_APP_PERMISSIONS,
    queryFn: getAppPermissions,
  });
  if (isFetching || permissionLoading || groupLoading) {
    return (
      <div className='flex justify-center mb-3'>
        <SyncLoader color='#6DAB3C' />
      </div>
    );
  } else {
    if (role && allPermissions && permissionWithGroup)
      return (
        <UpdateRoleForm
          role={role}
          setIsOpen={setIsOpen}
          permissionWithGroup={permissionWithGroup}
          allPermissions={allPermissions}
          rolePermissions={role.permissions.map((permission) => permission.id)}
        />
      );
  }
};

export default UpdateRoleLoad;
