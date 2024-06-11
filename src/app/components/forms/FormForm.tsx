import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import TextField from "../common/form/TextField";
import { createForm, getLocations } from "../../apis/forms";
import { useNavigate } from "react-router-dom";
import Modal from "../common/Modal";
import PatientSelect from "../patients/PatientSelect";
import { formSchema } from "../../utils/schemas/forms.schema";
import { IFormRequest } from "../../types/forms";
import { IPatient } from "../../types/pharmacy";
import { FORMS_LOCATIONS } from "../../utils/constants/queryKeys";
import Button from "../common/form/Button";
import OptionsField from "../common/form/OptionsField";

const FormForm = () => {
  const { data: locations } = useQuery({
    queryFn: getLocations,
    queryKey: FORMS_LOCATIONS,
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<Partial<IFormRequest>>({
    resolver: zodResolver(formSchema),
  });

  const navigate = useNavigate();

  const [patient, setPatient] = useState<IPatient>();
  const [selectPatientOpen, setSelectPatientOpen] = useState(false);

  const createFormMutation = useMutation(createForm);

  const onSubmit = (data: Partial<IFormRequest>) => {
    createFormMutation.mutate(data as IFormRequest, {
      onSuccess: () => {
        toast.success("Form Created");
        reset();
        navigate("/forms");
      },
    });
  };

  const changePatient = () => {
    setValue("patientId", patient?.id || "");
  };

  useEffect(() => {
    if (patient) {
      changePatient();
    }
  }, [patient]);

  return (
    <div className='w-full max-w-[800px] bg-white p-12 rounded-md'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col gap-4 w-full'>
          <div className='flex mb-2'>
            <div
              className='py-2 px-2 text-white cursor-pointer bg-darkblue rounded-md'
              onClick={() => setSelectPatientOpen(true)}
            >
              {patient ? "Change" : "Select"}
            </div>
          </div>
          <div className='grid'>
            <TextField
              type='text'
              value={patient?.patientNO}
              disabled={true}
              label='Patient NO'
            />
          </div>
          <div className='flex space-x-3'>
            {patient && (
              <>
                <div
                  className='py-1 px-2 text-red-500 bg-white cursor-pointer'
                  onClick={() => setPatient(undefined)}
                >
                  Remove
                </div>
              </>
            )}
          </div>
        </div>

        <div className='grid md:grid-cols-2 gap-4'>
          {locations && (
            <div className='block'>
              <OptionsField
                label='Type'
                register={register("at")}
                error={errors.at?.message}
                required={true}
                defaultLabel='Select type'
                options={locations?.map((location) => ({
                  value: location,
                  label: location,
                }))}
              />
            </div>
          )}
          <TextField
            type='number'
            label='Temprature'
            error={errors.details?.temperature?.message}
            register={register("details.temperature")}
          />
        </div>

        <div className='grid md:grid-cols-2 gap-4'>
          <TextField
            type='number'
            label='Height'
            error={errors.details?.height?.message}
            register={register("details.height")}
          />
          <TextField
            type='number'
            label='Weight'
            error={errors.details?.weight?.message}
            register={register("details.weight")}
          />
        </div>

        <div className='grid mt-6'>
          <Button isLoading={createFormMutation.isLoading} label='Create Form' />
        </div>

        <Modal
          isOpen={selectPatientOpen}
          onClose={() => setSelectPatientOpen(false)}
          title={`${patient ? "Change" : "Select"} patient`}
          big={true}
        >
          <PatientSelect
            setIsOpen={setSelectPatientOpen}
            patient={patient}
            setPatient={setPatient}
          />
        </Modal>
      </form>
    </div>
  );
};

export default FormForm;
