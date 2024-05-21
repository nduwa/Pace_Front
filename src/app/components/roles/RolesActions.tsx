import {
  TrashIcon,
  PencilIcon,
  InformationCircleIcon,
  BoltSlashIcon,
} from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import ConfirmDelete from "../common/ConfirmDelete";
import Modal from "../common/Modal";
import Protected from "../auth/Protected";
import { ALL_ROLES } from "../../utils/constants/queryKeys";
import { IPermissionsGroup, IRole } from "../../types/common";
import { deleteRole } from "../../apis/roles";
import RoleDetails from "./RoleDetails";
import UpdateRoleLoad from "./UpdateRoleLoad";

interface IRoleActionsProps {
  role: IRole;
  permissionWithGroup: IPermissionsGroup[];
}

const RoleActions: FC<IRoleActionsProps> = ({ role, permissionWithGroup }) => {
  const { id } = role;
  const [isOpen, setIsOpen] = useState(false);
  const [toDelete, setToDelete] = useState<string | undefined>();
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <>
      <div
        id={id}
        className='w-full bg-[rgba(108,171,60,0.09)] flex p-2 gap-2 justify-center items-center'
      >
        {role.label === "INSTITUTION_ADMIN" && (
          <div className='flex gap-2 py-1 px-2'>
            <BoltSlashIcon className='w-5 text-red' />
          </div>
        )}
        {role.label !== "INSTITUTION_ADMIN" && (
          <>
            <Protected permissions={["INSTITUTION_ADMIN"]}>
              <div
                className='flex gap-2 py-1 px-2 cursor-pointer'
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                <PencilIcon className='w-5 text-green' />
              </div>
              {isOpen && (
                <Modal
                  isOpen={isOpen}
                  onClose={() => {
                    setIsOpen(false);
                  }}
                  title={`Update role`}
                >
                  <UpdateRoleLoad roleId={role.id} setIsOpen={setIsOpen} />
                </Modal>
              )}
            </Protected>

            <Protected permissions={["INSTITUTION_ADMIN"]}>
              {toDelete && (
                <ConfirmDelete
                  type='role'
                  id={toDelete}
                  fn={async (id: string) => {
                    await deleteRole(id);
                    return 1;
                  }}
                  queryKey={ALL_ROLES}
                  setToDelete={setToDelete}
                />
              )}
              <div className='flex gap-2 py-1 px-2' onClick={() => setToDelete(id)}>
                <TrashIcon className='w-5 text-red-500 cursor-pointer' />
              </div>
            </Protected>
            <div className='flex gap-2 py-1 px-2'>
              <InformationCircleIcon
                className='w-5 text-blue-500 cursor-pointer'
                onClick={() => setDetailsOpen(true)}
              />
            </div>

            {detailsOpen && (
              <Modal
                isOpen={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                title={`${role.label}`}
              >
                <RoleDetails
                  role={role as IRole}
                  permissionwithGroup={permissionWithGroup}
                />
              </Modal>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default RoleActions;
