import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, FC, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { PATIENTS } from "../../utils/constants/queryKeys";
import TextField from "../common/form/TextField";
import OptionsField from "../common/form/OptionsField";
import Button from "../common/form/Button";
import { IPatient, IPatientRequest } from "../../types/pharmacy";
import { patientSchema } from "../../utils/schemas/patient.shema";
import { addDependent, createPatient, updatePatient } from "../../apis/patients";
import {
  IDistrict,
  IProvince,
  rwandaDitsricts,
  rwandaProvinces,
} from "../../constants/addresses";
import RadioButton from "../common/form/RadioButton";

interface IPatientUpdateForm {
  isAddDependant?: boolean;
  patient?: IPatient;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const PatientForm: FC<IPatientUpdateForm> = ({
  patient,
  setIsOpen,
  isAddDependant,
}) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<IPatientRequest>({
    resolver: zodResolver(patientSchema),
    defaultValues: isAddDependant
      ? { NID: patient?.NID }
      : {
          ...patient,
        },
  });

  const createPatientMutation = useMutation(createPatient);
  const updatePatientMutation = useMutation(updatePatient);
  const addDependantMutation = useMutation(addDependent);

  const onSubmit = (data: IPatientRequest) => {
    if (patient && patient.id) {
      if (isAddDependant) {
        addDependantMutation.mutate({ id: patient.id, ...data } as IPatient, {
          onSuccess() {
            toast.success("Dependant added successfully");
            setIsOpen(false);
            queryClient.invalidateQueries(PATIENTS);
            reset();
          },
        });
      } else {
        updatePatientMutation.mutate({ id: patient.id, ...data } as IPatient, {
          onSuccess() {
            toast.success("Patient updated successfully");
            setIsOpen(false);
            queryClient.invalidateQueries(PATIENTS);
            reset();
          },
        });
      }
    } else {
      createPatientMutation.mutate(data, {
        onSuccess() {
          toast.success("Patient created successfully");
          setIsOpen(false);
          queryClient.invalidateQueries(PATIENTS);
          reset();
        },
      });
    }
  };

  const [districts, setDistricts] = useState<Partial<IDistrict>[]>(
    rwandaDitsricts[
      (patient?.address.province || "City Of Kigali") as unknown as IProvince
    ] as unknown as IDistrict[],
  );
  const provinceChange = (province: string) => {
    setValue("address.province", province);
    setDistricts(rwandaDitsricts[province as IProvince] as unknown as IDistrict[]);
  };

  console.log(errors);
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='flex gap-4 flex-col'>
        <div className='block'>
          <TextField
            label='Name'
            type='text'
            error={errors.name?.message}
            register={register("name")}
          />
        </div>
        {!isAddDependant && (
          <div className='block'>
            <TextField
              label='NID (16 digits)'
              type='text'
              error={errors.NID?.message}
              register={register("NID")}
            />
          </div>
        )}
        <div className='grid grid-cols-2 gap-4'>
          <div className='block'>
            <div className='font-medium text-sm'>Gender</div>
            <div className='grid grid-cols-2 mt-2'>
              <RadioButton label='Male' value='Male' register={register("gender")} />
              <RadioButton
                label='Female'
                value='Female'
                register={register("gender")}
              />
            </div>
          </div>
          <TextField
            label='Birth Date '
            type='date'
            error={errors.birthDate?.message}
            register={register("birthDate")}
          />
        </div>

        <div className='grid grid-cols-2 gap-4 mt-4'>
          <div className='block'>
            <OptionsField
              label='Province'
              register={register("address.province")}
              error={errors.address?.province?.message}
              required={true}
              defaultLabel='Select type'
              options={rwandaProvinces?.map((province) => ({
                value: province,
                label: province,
              }))}
              onValueChage={provinceChange}
            />
          </div>
          <div className='block'>
            <OptionsField
              label='District'
              register={register("address.district")}
              error={errors.address?.district?.message}
              required={true}
              defaultLabel='Select type'
              options={districts.map((district) => ({
                value: district,
                label: district,
              }))}
            />
          </div>
          <TextField
            label='Sector'
            type='text'
            error={errors.address?.sector?.message}
            register={register("address.sector")}
          />
          <TextField
            label='Cell'
            type='text'
            error={errors.address?.cell?.message}
            register={register("address.cell")}
          />
          <TextField
            label='Village'
            type='text'
            error={errors.address?.village?.message}
            register={register("address.village")}
          />
          <div className='block'>
            <TextField
              label='Phone'
              type='text'
              error={errors.phone?.message}
              register={register("phone")}
            />
          </div>
        </div>

        <div className='py-4 mx-auto flex items-center justify-end md:justify-start md:flex-start space-x-2'>
          <Button
            isLoading={
              !patient
                ? createPatientMutation.isLoading
                : isAddDependant
                ? addDependantMutation.isLoading
                : updatePatientMutation.isLoading
            }
            label={
              !patient
                ? "Create Patient"
                : isAddDependant
                ? "Add dependant"
                : "Update Patient"
            }
          />
        </div>
      </form>
    </>
  );
};

export default PatientForm;
