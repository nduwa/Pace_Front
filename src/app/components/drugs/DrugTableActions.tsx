import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import Protected from "../auth/Protected";
import Modal from "../common/Modal";
import DrugForm from "./DrugForm";
import ConfirmDelete from "../common/ConfirmDelete";
import { deleteDrug } from "../../apis/drug";
import { DRUGS } from "../../utils/constants/queryKeys";
import { IDrug } from "../../types/pharmacy";

interface IDrugTableActionsProps {
  drug: IDrug;
}

const DrugTableActions: FC<IDrugTableActionsProps> = ({ drug }) => {
  const { id } = drug;
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
          <Protected permissions={["UPDATE_MEDECINES"]}>
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
                title={`Update ${drug.drug_code}`}
              >
                <DrugForm drug={drug} setIsOpen={setIsOpen} />
              </Modal>
            )}
          </Protected>

          <Protected permissions={["UPDATE_MEDECINES"]}>
            {toDelete && (
              <ConfirmDelete
                type='drug'
                id={toDelete}
                fn={async (id: string) => {
                  await deleteDrug(id);
                  return 1;
                }}
                queryKey={DRUGS}
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

export default DrugTableActions;
