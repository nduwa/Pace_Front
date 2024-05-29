import { CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import Protected from "../auth/Protected";
import Modal from "../common/Modal";
import { IInstitutionDrug } from "../../types/pharmacy";
import DrugPriceForm from "./DrugPriceForm";

interface IInstitutionDrugTableActionsProps {
  drug: IInstitutionDrug;
}

const InstitutionDrugTableActions: FC<IInstitutionDrugTableActionsProps> = ({
  drug,
}) => {
  const [updatePrice, setUpdatePrice] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      {isOpen && (
        <div id={drug.id} className='w-full'>
          <Protected permissions={["UPDATE_MEDECINES"]}>
            <div
              className='flex gap-2 py-1 px-2 hover:bg-gray-100 cursor-pointer'
              onClick={() => setUpdatePrice(true)}
            >
              <CurrencyDollarIcon className='w-4 text-green' /> Edit
            </div>
            {updatePrice && (
              <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={`Update ${drug.drug?.drug_code}`}
                big={false}
              >
                <DrugPriceForm drug={drug} setIsOpen={setIsOpen} />
              </Modal>
            )}
          </Protected>
        </div>
      )}
    </>
  );
};

export default InstitutionDrugTableActions;
