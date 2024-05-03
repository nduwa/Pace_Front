import { IPatient } from "../../types/pharmacy";
import { UserCircleIcon } from "@heroicons/react/24/outline";

interface PatientDetailsProps {
  patient: IPatient;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ patient }) => {
  return (
    <>
      <ul>
        <li className='col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white shadow'>
          <div className='flex flex-1 flex-col p-8'>
            <h3 className='mt-6 text-xl font-medium text-gray-900'>
              {patient?.name}
            </h3>

            <dl className='mt-3 flex flex-grow flex-col justify-start'>
              <dd className='text-sm text-gray-500'>
                <p className='mb-2'>
                  <span className='font-bold w-60 inline-block'>Phone:</span>{" "}
                  {patient.phone}
                </p>
              </dd>
            </dl>
            <dl className='mt-3 flex flex-grow flex-col justify-start'>
              <dd className='text-sm text-gray-500'>
                <p className='mb-2'>
                  <span className='font-bold w-60 inline-block'>NID:</span>{" "}
                  {patient.NID}
                </p>
              </dd>
            </dl>
            <dl className='mt-3 flex flex-grow flex-col justify-start'>
              <dd className='text-sm text-gray-500'>
                <p className='mb-2'>
                  <span className='font-bold w-60 inline-block'>NIDIndex:</span>{" "}
                  {patient.NIDIndex}
                </p>
              </dd>
            </dl>

            <dl className='mt-3 flex flex-grow flex-col justify-start'>
              <dd className='text-sm text-gray-500'>
                <p className='mb-2'>
                  <span className='font-bold w-60 inline-block'>Province:</span>{" "}
                  {patient.address.province}
                </p>
              </dd>
            </dl>
            <dl className='mt-3 flex flex-grow flex-col justify-start'>
              <dd className='text-sm text-gray-500'>
                <p className='mb-2'>
                  <span className='font-bold w-60 inline-block'>District:</span>{" "}
                  {patient.address.district}
                </p>
              </dd>
            </dl>
            <dl className='mt-3 flex flex-grow flex-col justify-start'>
              <dd className='text-sm text-gray-500'>
                <p className='mb-2'>
                  <span className='font-bold w-60 inline-block'>Sector:</span>{" "}
                  {patient.address.sector}
                </p>
              </dd>
            </dl>
            <dl className='mt-3 flex flex-grow flex-col justify-start'>
              <dd className='text-sm text-gray-500'>
                <p className='mb-2'>
                  <span className='font-bold w-60 inline-block'>Cell:</span>{" "}
                  {patient.address.cell}
                </p>
              </dd>
            </dl>
            <dl className='mt-3 flex flex-grow flex-col justify-start'>
              <dd className='text-sm text-gray-500'>
                <p className='mb-2'>
                  <span className='font-bold w-60 inline-block'>Village:</span>{" "}
                  {patient.address.village}
                </p>
              </dd>
            </dl>
          </div>
          {patient.dependents && patient.dependents.length > 0 && (
            <div className='p-8'>
              <>
                <h3 className='font-bold w-60 inline-block'>Dependent patients</h3>
                {patient.dependents.map((child: IPatient) => (
                  <ol className='relative border-left border-gray-200 dark:border-gray-700'>
                    <li className='mb-3 relative flex items-center space-x-3'>
                      <span className='flex items-center justify-center w-6 h-6 rounded-full'>
                        <UserCircleIcon className='w-5' />
                      </span>
                      <p className='flex items-center mb-1 text-md'>
                        {child.name} ({child.patientNO})
                      </p>
                    </li>
                  </ol>
                ))}
              </>
            </div>
          )}
        </li>
      </ul>
    </>
  );
};

export default PatientDetails;
