import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import { IInstitution } from "../../types/common";
import Protected from "../auth/Protected";
import Modal from "../common/Modal";
import InstitutionForm from "./InstitutionForm";
import ConfirmDelete from "../common/ConfirmDelete";
import { deleteInstitution } from "../../apis/institution";
import { INSTITUTIONS } from "../../utils/constants/queryKeys";

interface IInstitutionTableActionsProps {
  institution: IInstitution;
}

const InstitutionTableActions: FC<IInstitutionTableActionsProps> = ({
  institution,
}) => {
  const { id } = institution;
  const [toUpdate, setToUpdate] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [toDelete, setToDelete] = useState<string | undefined>();

  const update = (id: string) => {
    setToUpdate(id);
  };

  return (
    <>
      {isOpen && (
        <div id={id} className='w-full'>
          <Protected permissions={["UPDATE_INSTITUTIONS"]}>
            <div
              className='flex gap-2 py-1 px-2 hover:bg-gray-100 cursor-pointer'
              onClick={() => update(id)}
            >
              <PencilIcon className='w-4 text-green' /> Edit
            </div>
            {toUpdate != "" && (
              <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={`Update ${institution.name}`}
              >
                <InstitutionForm institution={institution} setIsOpen={setIsOpen} />
              </Modal>
            )}
          </Protected>

          <Protected permissions={["UPDATE_INSTITUTIONS"]}>
            {toDelete && (
              <ConfirmDelete
                type='institution'
                id={toDelete}
                fn={async (id: string) => {
                  await deleteInstitution(id);
                  return 1;
                }}
                queryKey={INSTITUTIONS}
                setToDelete={setToDelete}
              />
            )}
            <div
              className='flex gap-2 py-1 px-2 hover:bg-gray-100 cursor-pointer'
              onClick={() => setToDelete(id)}
            >
              <TrashIcon className='w-4 text-red' /> Delete
            </div>
          </Protected>
        </div>
      )}
    </>
  );
};

export default InstitutionTableActions;
