import { FC, useState } from "react";
import { IUserProfile } from "../../types/common";
import Protected from "../auth/Protected";
import Modal from "../common/Modal";
import { EyeIcon, ShieldExclamationIcon } from "@heroicons/react/24/outline";
import GetUserDetails from "./GetUserDetails";
import AccessControlForm from "./AccessControl";

interface IUsersTableActionsProps {
  user: IUserProfile;
}

const UsersTableActions: FC<IUsersTableActionsProps> = ({ user }) => {
  const [userDetailsModalOpened, setUserDetailsModalOpened] =
    useState<boolean>(false);
  const [accessForm, setAccessForm] = useState(false);

  return (
    <div id={user.id} className='w-full'>
      <div
        className='flex gap-2 py-1 px-2 hover:bg-gray-100 cursor-pointer'
        onClick={() => setUserDetailsModalOpened(true)}
      >
        <EyeIcon className='w-4 text-darkblue' /> Details
      </div>
      <Modal
        title='User Details'
        isOpen={userDetailsModalOpened}
        onClose={() => setUserDetailsModalOpened(false)}
      >
        <GetUserDetails userId={user.id || ""} />
      </Modal>

      <Protected permissions={["INSTITUTION_ADMIN"]}>
        <div
          className='flex gap-2 py-1 px-2 hover:bg-gray-100 cursor-pointer'
          onClick={() => setAccessForm(true)}
        >
          <ShieldExclamationIcon className='w-4 text-orange-600' /> Access control
        </div>
        {accessForm && user.id && (
          <Modal
            isOpen={accessForm}
            onClose={() => setAccessForm(false)}
            title={user?.name || ""}
            key={user.id}
          >
            <AccessControlForm user={user} setIsOpen={setAccessForm} />
          </Modal>
        )}
      </Protected>
    </div>
  );
};

export default UsersTableActions;
