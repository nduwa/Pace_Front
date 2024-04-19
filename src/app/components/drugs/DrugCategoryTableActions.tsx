import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import Protected from "../auth/Protected";
import Modal from "../common/Modal";
import DrugCategoryForm from "./DrugCategoryForm";
import ConfirmDelete from "../common/ConfirmDelete";
import { DRUGS_CATEGORIES } from "../../utils/constants/queryKeys";
import { IDrugCategory } from "../../types/pharmacy";
import { deleteDrugCategory } from "../../apis/drug";

interface IDrugCategoryTableActionsProps {
  category: IDrugCategory;
}

const DrugCategoryTableActions: FC<IDrugCategoryTableActionsProps> = ({
  category,
}) => {
  const { id } = category;
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
                title={`Update ${category.name}`}
              >
                <DrugCategoryForm category={category} setIsOpen={setIsOpen} />
              </Modal>
            )}
          </Protected>

          <Protected permissions={["UPDATE_MEDECINES"]}>
            {toDelete && (
              <ConfirmDelete
                type='category'
                id={toDelete}
                fn={async (id: string) => {
                  await deleteDrugCategory(id);
                  return 1;
                }}
                queryKey={DRUGS_CATEGORIES}
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

export default DrugCategoryTableActions;
