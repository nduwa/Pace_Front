import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import Modal from "../common/Modal";
import ExamForm from "./ExamForm";
import ConfirmDelete from "../common/ConfirmDelete";
import { EXAMS } from "../../utils/constants/queryKeys";
import { IExam } from "../../types/exams";
import { deleteExam } from "../../apis/exams";

interface IExamTableActionsProps {
  exam: IExam;
}

const ExamTableActions: FC<IExamTableActionsProps> = ({ exam }) => {
  const { id } = exam;
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
              title={`Update ${exam.exam_code}`}
            >
              <ExamForm exam={exam} setIsOpen={setIsOpen} />
            </Modal>
          )}

          {toDelete && (
            <ConfirmDelete
              type='exam'
              id={toDelete}
              fn={async (id: string) => {
                await deleteExam(id);
                return 1;
              }}
              queryKey={EXAMS}
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

export default ExamTableActions;
