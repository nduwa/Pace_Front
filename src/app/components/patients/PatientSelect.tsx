import { useMutation } from "@tanstack/react-query";
import { Dispatch, FC, SetStateAction, useState } from "react";
import TextField from "../common/form/TextField";
import { IPatient } from "../../types/pharmacy";
import { getpatients } from "../../apis/patients";
import Table from "../table/Table";

interface ISelectPatient {
  patient?: IPatient;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setPatient: Dispatch<SetStateAction<IPatient | undefined>>;
}

const PatientSelect: FC<ISelectPatient> = ({ patient, setIsOpen, setPatient }) => {
  const [data, setData] = useState<IPatient[]>();

  const patientsMutation = useMutation(getpatients);

  const handleSearch = (searchq: string) => {
    patientsMutation.mutate(`?searchq=${searchq}`, {
      onSuccess(result) {
        setData(result);
      },
    });
  };

  const handleChange = (value: string) => {
    if (value.length > 5) {
      handleSearch(value);
    }
  };

  return (
    <>
      <div className='flex flex-col space-y-6'>
        <div className='max-w-md flex flex-col'>
          <TextField type='text' onValueChage={handleChange} />
          <span className='text-sm text-gray-500'>
            Name | NID | Phone | NO ~ 5+ characters
          </span>
        </div>

        <div>
          <div className='font-bold text-lg'>Patients</div>
          <Table
            isLoading={patientsMutation.isLoading}
            position='relative'
            columns={[
              {
                title: "",
                key: "",
                render: (row: IPatient) => (
                  <>
                    {patient?.id == row.id && <span>Selected</span>}
                    {patient?.id !== row.id && (
                      <span
                        className='text-darkblue'
                        onClick={() => {
                          setPatient(row);
                          setIsOpen(false);
                        }}
                      >
                        Select
                      </span>
                    )}
                  </>
                ),
              },
              {
                title: "PatientNO",
                key: "patientNO",
              },
              {
                title: "Name",
                key: "name",
              },
              {
                title: "Phone",
                key: "phone",
              },
              {
                title: "NID",
                key: "NID",
              },
              {
                title: "Index",
                key: "NIDIndex",
              },
            ]}
            data={data || []}
          />
        </div>
      </div>
    </>
  );
};

export default PatientSelect;
