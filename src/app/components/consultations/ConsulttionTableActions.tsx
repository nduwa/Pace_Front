import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import Modal from "../common/Modal";
import ConsultationForm from "./ConsultationForm";
import ConfirmDelete from "../common/ConfirmDelete";
import { CONSULTATIONS } from "../../utils/constants/queryKeys";
import { IConsultation } from "../../types/common";
import { deleteConsultation } from "../../apis/consultation";

interface IConsultationTableActionsProps {
  consultation: IConsultation;
}

const ConsultationTableActions: FC<IConsultationTableActionsProps> = ({
  consultation,
}) => {
  const { id } = consultation;
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
              title={`Update ${consultation.label}`}
            >
              <ConsultationForm consultation={consultation} setIsOpen={setIsOpen} />
            </Modal>
          )}

          {toDelete && (
            <ConfirmDelete
              type='consultation'
              id={toDelete}
              fn={async (id: string) => {
                await deleteConsultation(id);
                return 1;
              }}
              queryKey={CONSULTATIONS}
              setToDelete={setToDelete}
            />
          )}
          <div
            className='flex gap-2 py-1 px-2 hover:bg-gray-100 cursor-pointer'
            onClick={() => setToDelete(id)}
          >
            <TrashIcon className='w-4 text-red' /> Delete
          </div>
        </div>
      )}
    </>
  );
};

export default ConsultationTableActions;
