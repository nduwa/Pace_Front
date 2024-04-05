import { useQuery } from "@tanstack/react-query";
import { ALL_GROUPED_PERMISSIONS } from "../../utils/constants/queryKeys";
import { getGroupedPermissions } from "../../apis/roles";

import { FC } from "react";
import { IPermissionsGroup, IRole } from "../../types/common";
import RolePermissionGroup from "./RolePermissionGroup";

interface IRoleDetails {
  role: IRole;
  permissionwithGroup: IPermissionsGroup[];
}
const RoleDetails: FC<IRoleDetails> = ({ role }) => {
  const { data: permissionWithGroup } = useQuery({
    queryKey: ALL_GROUPED_PERMISSIONS,
    queryFn: getGroupedPermissions,
  });

  return (
    <>
      {permissionWithGroup && (
        <div className=' space-y-4'>
          <div className='grid'>
            {permissionWithGroup
              ?.filter((item) => item.group != "SUDO")
              .map((permissionGroup) => (
                <RolePermissionGroup
                  key={permissionGroup.group}
                  permissions={role.permissions}
                  group={permissionGroup}
                />
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default RoleDetails;
