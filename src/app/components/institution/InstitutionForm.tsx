import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, FC, SetStateAction } from "react";
import toast from "react-hot-toast";
import { IInstitution, IInstitutionRequest } from "../../types/common";
import { institutionSchema } from "../../utils/schemas/institution.schema";
import { createInstitution, updateInstitution } from "../../apis/institution";
import { INSTITUTIONS, USER_PROFILE } from "../../utils/constants/queryKeys";
import TextField from "../common/form/TextField";
import OptionsField from "../common/form/OptionsField";
import Button from "../common/form/Button";
import Checkbox from "../common/form/Checkbox";

interface IInstitutionUpdateForm {
  institution?: IInstitution;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  settingUpdate?: boolean;
}

const InstitutionForm: FC<IInstitutionUpdateForm> = ({
  institution,
  setIsOpen,
  settingUpdate = false,
}) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IInstitutionRequest>({
    resolver: zodResolver(institutionSchema),
    defaultValues: {
      ...institution,
    },
  });

  const createInstitutionMutation = useMutation(createInstitution);
  const updateInstitutionMutation = useMutation(updateInstitution);

  const onSubmit = (data: IInstitutionRequest) => {
    if (institution && institution.id) {
      updateInstitutionMutation.mutate(
        { id: institution.id, ...data } as IInstitution,
        {
          onSuccess() {
            toast.success("Institution updated successfully");
            setIsOpen && setIsOpen(false);
            queryClient.invalidateQueries(INSTITUTIONS);
            !settingUpdate && reset();
            settingUpdate && queryClient.invalidateQueries(USER_PROFILE);
          },
        },
      );
    } else {
      createInstitutionMutation.mutate(data, {
        onSuccess() {
          toast.success("Institution created successfully");
          setIsOpen && setIsOpen(false);
          queryClient.invalidateQueries(INSTITUTIONS);
          reset();
        },
      });
    }
  };

  const institutionTypes = ["PHARMACY", "CLINIC", "INSURANCE"];

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
        <div className={`${institution ? "hidden" : "block"}`}>
          <OptionsField
            label='Type'
            register={register("institutionType")}
            error={errors.institutionType?.message}
            required={true}
            defaultLabel='Select type'
            options={institutionTypes?.map((type) => ({
              value: type,
              label: type,
            }))}
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <TextField
            label='TIN'
            type='text'
            error={errors.details?.TIN?.message}
            register={register("details.TIN")}
          />
          <TextField
            label='Location'
            type='text'
            error={errors.details?.location?.message}
            register={register("details.location")}
          />
        </div>
        {settingUpdate &&
          institution &&
          institution.institutionType === "CLINIC" && (
            <div className='mt-2 flex flex-col gap-4'>
              <Checkbox
                label='Has Pharmacy (can distibute med)'
                register={register("hasPharmacy")}
                checked={true}
              />
            </div>
          )}

        <div className='mt-4'>
          {institution && (
            <>
              <div className='text-lg text-darkblue font-base'>Admin details</div>
            </>
          )}
          {!institution && (
            <>
              <div className='text-lg text-darkblue font-base'>User details</div>
              <p className='text-sm'>
                This will be the admin as default, and the contact info for
                institution
              </p>
            </>
          )}

          <div className='mt-2 flex flex-col gap-4'>
            <TextField
              label='Name'
              type='text'
              error={errors.admin?.name?.message}
              register={register("admin.name")}
            />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <TextField
              label='Phone'
              type='text'
              error={errors.admin?.phone?.message}
              register={register("admin.phone")}
            />
            <TextField
              label='Email'
              type='text'
              error={errors.admin?.email?.message}
              register={register("admin.email")}
            />
          </div>
        </div>
        <div className='py-4 mx-auto flex items-center justify-end md:justify-start md:flex-start space-x-2'>
          <Button
            isLoading={
              institution && institution.id
                ? updateInstitutionMutation.isLoading
                : createInstitutionMutation.isLoading
            }
            label={
              institution && institution.id
                ? "Update Institution"
                : "Create Institution"
            }
          />
        </div>
      </form>
    </>
  );
};

export default InstitutionForm;
