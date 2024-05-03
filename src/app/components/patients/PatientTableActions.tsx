import {
  TrashIcon,
  PencilIcon,
  EyeIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import Protected from "../auth/Protected";
import Modal from "../common/Modal";
import PatientForm from "./PatientForm";
import ConfirmDelete from "../common/ConfirmDelete";
import { IPatient } from "../../types/pharmacy";
import { deletePatient } from "../../apis/patients";
import { PATIENTS } from "../../utils/constants/queryKeys";
import PatientDetails from "./PatientDetail";

interface IPatientTableActionsProps {
  patient: IPatient;
}

const PatientTableActions: FC<IPatientTableActionsProps> = ({ patient }) => {
  const { id } = patient;
  const [toUpdate, setToUpdate] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [toDelete, setToDelete] = useState<string | undefined>();
  const [details, setDetails] = useState<boolean>(false);
  const [addDependant, setAddDependant] = useState<boolean>(false);

  const update = (id: string) => {
    setToUpdate(id);
  };

  return (
    <>
      {isOpen && (
        <div id={id} className='w-full'>
          <div
            className='flex gap-2 py-1 px-2 hover:bg-gray-100 cursor-pointer'
            onClick={() => setDetails(true)}
          >
            <EyeIcon className='w-4 text-green' /> Details
          </div>
          <Modal
            title={`${patient.patientNO} ${patient.name}`}
            isOpen={details}
            onClose={() => setDetails(false)}
          >
            <PatientDetails patient={patient} />
          </Modal>

          <Protected permissions={["UPDATE_PATIENTS"]}>
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
                title={`Update ${patient.name}`}
              >
                <PatientForm patient={patient} setIsOpen={setIsOpen} />
              </Modal>
            )}

            {(patient.NIDIndex == null || patient.NIDIndex == 0) && (
              <>
                <div
                  className='flex gap-2 py-1 px-2 hover:bg-gray-100 cursor-pointer'
                  onClick={() => setAddDependant(true)}
                >
                  <UsersIcon className='w-4 text-green' /> Add dependant
                </div>
                {addDependant && (
                  <Modal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    title={`Add dependant to  ${patient.name}`}
                  >
                    <PatientForm
                      patient={patient}
                      setIsOpen={setIsOpen}
                      isAddDependant={true}
                    />
                  </Modal>
                )}
              </>
            )}
          </Protected>

          <Protected permissions={["UPDATE_PATIENTS"]}>
            {toDelete && (
              <ConfirmDelete
                type='patient'
                id={toDelete}
                fn={async (id: string) => {
                  await deletePatient(id);
                  return 1;
                }}
                queryKey={PATIENTS}
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

export default PatientTableActions;
