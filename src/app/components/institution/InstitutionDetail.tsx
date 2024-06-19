import { FC } from "react";
import { IInstitution } from "../../types/common";

type ProfileFields = {
  Name: string;
  Type: string;
  Admin_Name: string;
  Admin_Email: string;
  Admin_Phone: string;
  Location: string;
  TIN: string;
  Parent_Branch: string;
};

type props = {
  institution: IInstitution;
};

const InstitutionDetails: FC<props> = ({ institution }) => {
  const institutionData = {
    Name: institution?.name || "N/A",
    Type: institution?.institutionType || "N/A",
    Admin_Name: institution?.admin.name || "N/A",
    Admin_Phone: institution?.admin.phone || "N/A",
    Admin_Email: institution?.admin.email || "N/A",
    Location: institution?.details.location || "N/A",
    TIN: institution?.details.TIN || "N/A",
  } as ProfileFields;

  return (
    <div>
      <div className='lg:pb-8 py-6'>
        <div className='overflow-hidden rounded-lg bg-white py-6 '>
          <div className='mx-auto mt-6 mb-0 max-w-5xl px-4 sm:px-6 lg:px-8'>
            <dl className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2'>
              {Object.keys(institutionData).map((field) => (
                <div key={field} className='sm:col-span-1'>
                  <dt className='text-sm font-medium text-gray-500'>
                    {field.replace("_", " ")}
                  </dt>
                  <dd className='mt-1 text-sm text-gray-900'>
                    {(institutionData as any)[field]}
                  </dd>
                </div>
              ))}

              {institution?.parentInstitution && (
                <div className='sm:col-span-1'>
                  <dt className='text-sm font-medium text-gray-500'>
                    Parent Institution
                  </dt>
                  <dd className='mt-1 text-sm text-gray-900'>
                    {institution.parentInstitution.name}
                  </dd>
                </div>
              )}

              {institution?.institutionType === "CLINIC" && (
                <div className='sm:col-span-1'>
                  <dt className='text-sm font-medium text-gray-500'>Has Pharmacy</dt>
                  <dd className='mt-1 text-sm text-gray-900'>
                    {institution.hasPharmacy ? "Yes" : "No"}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionDetails;
