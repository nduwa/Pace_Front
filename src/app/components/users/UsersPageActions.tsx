import { useState } from "react";
import Modal from "../common/Modal";
import Button from "../common/form/Button";
import AddUserForm from "./AddUserForm";
import Protected from "../auth/Protected";

const UsersPageActions = () => {
  const [createUserModalOpened, setCreateUserModalOpened] = useState<boolean>(false);

  return (
    <>
      <Protected permissions={["UPDATE_USERS"]}>
        <>
          <Modal
            title={`Add New User`}
            isOpen={createUserModalOpened}
            onClose={() => setCreateUserModalOpened(false)}
          >
            <AddUserForm closeModal={() => setCreateUserModalOpened(false)} />
          </Modal>
          <Button label={`Add`} onClick={() => setCreateUserModalOpened(true)} />
        </>
      </Protected>
    </>
  );
};

export default UsersPageActions;
