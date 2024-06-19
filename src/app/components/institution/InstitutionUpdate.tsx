import { FC } from "react";
import { IInstitution } from "../../types/common";
import InstitutionForm from "./InstitutionForm";

type props = {
  institution: IInstitution;
};

const InstitutionUpdate: FC<props> = ({ institution }) => {
  return (
    <div>
      <div className='lg:pb-8 py-6'>
        <div className=''>
          <div className='max-w-md mt-6 mb-0 max-w-5xl px-4 sm:px-6 lg:px-8  bg-white py-6  rounded-md'>
            <InstitutionForm institution={institution} settingUpdate={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstitutionUpdate;
