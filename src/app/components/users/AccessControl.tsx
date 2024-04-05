import { useQuery } from "@tanstack/react-query";
import {
  ALL_ROLES,
  USER,
  ALL_APP_PERMISSIONS,
  ALL_GROUPED_PERMISSIONS,
} from "../../utils/constants/queryKeys";
import {
  getRoles,
  getGroupedPermissions,
  getAppPermissions,
} from "../../apis/roles";
import { Dispatch, FC, SetStateAction } from "react";
import { IUserProfile } from "../../types/common";
import { SyncLoader } from "react-spinners";
import AssignRolesForm from "./AssignRolesForm";
import { getUser } from "../../apis/users";

interface IAccessControlForm {
  user: IUserProfile;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
const AccessControlForm: FC<IAccessControlForm> = ({ user, setIsOpen }) => {
  const { data: roles, isLoading } = useQuery({
    queryFn: getRoles,
    queryKey: ALL_ROLES,
  });

  const { data: userfromDB, isFetching: userLoading } = useQuery({
    queryFn: () => getUser(user.id || ""),
    queryKey: USER,
  });

  const { data: permissionWithGroup, isLoading: groupLoading } = useQuery({
    queryKey: ALL_GROUPED_PERMISSIONS,
    queryFn: getGroupedPermissions,
  });
  const { data: allPermissions, isLoading: permissionLoading } = useQuery({
    queryKey: ALL_APP_PERMISSIONS,
    queryFn: getAppPermissions,
  });

  if (isLoading || userLoading || permissionLoading || groupLoading) {
    return (
      <div className='flex justify-center mb-3'>
        <SyncLoader color='#6DAB3C' />
      </div>
    );
  } else {
    if (roles && userfromDB && allPermissions && permissionWithGroup)
      return (
        <AssignRolesForm user={userfromDB} roles={roles} setIsOpen={setIsOpen} />
      );
  }
};

export default AccessControlForm;
