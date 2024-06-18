import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, FC, SetStateAction } from "react";
import toast from "react-hot-toast";
import { createDrug, getdrugCategoriesNPaged, updateDrug } from "../../apis/drug";
import {
  DRUGS,
  DRUGS_CATEGORIES,
  DRUG_CATEGORIS_NPAGED,
} from "../../utils/constants/queryKeys";
import TextField from "../common/form/TextField";
import Button from "../common/form/Button";
import { IDrug, IDrugRequest } from "../../types/pharmacy";
import { drugSchema } from "../../utils/schemas/drug.schema";
import TextArea from "../common/form/TextArea";
import OptionsField from "../common/form/OptionsField";

interface IDrugUpdateForm {
  drug?: IDrug;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const DrugForm: FC<IDrugUpdateForm> = ({ drug, setIsOpen }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IDrugRequest>({
    resolver: zodResolver(drugSchema),
    defaultValues: {
      ...drug,
    },
  });

  const createDrugMutation = useMutation(createDrug);
  const updateDrugMutation = useMutation(updateDrug);

  const { data: drugCategorys } = useQuery({
    queryFn: getdrugCategoriesNPaged,
    queryKey: DRUG_CATEGORIS_NPAGED,
  });
  const onSubmit = (data: IDrugRequest) => {
    if (drug && drug.id) {
      updateDrugMutation.mutate({ id: drug.id, ...data } as IDrug, {
        onSuccess() {
          toast.success("Drug updated successfully");
          setIsOpen(false);
          queryClient.invalidateQueries(DRUG_CATEGORIS_NPAGED);
          queryClient.invalidateQueries(DRUGS_CATEGORIES);
          reset();
        },
      });
    } else {
      createDrugMutation.mutate(data, {
        onSuccess() {
          toast.success("Drug created successfully");
          setIsOpen(false);
          queryClient.invalidateQueries(DRUGS);
          reset();
        },
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='flex gap-4 flex-col'>
        <div className='grid sm:grid-cols-2 gap-4'>
          <div className='block'>
            <TextField
              label='Drug code'
              type='text'
              error={errors.drug_code?.message}
              register={register("drug_code")}
            />
          </div>
          {drugCategorys && (
            <div className='block'>
              <OptionsField
                label='Type'
                register={register("drugCategory")}
                error={errors.drugCategory?.message}
                required={true}
                defaultLabel='Select type'
                options={drugCategorys?.map((category) => ({
                  value: category.name,
                  label: category.name,
                }))}
              />
            </div>
          )}
        </div>

        <div className='block'>
          <TextField
            label='Instruction'
            type='text'
            error={errors.instruction?.message}
            register={register("instruction")}
          />
        </div>

        <div className='block'>
          <TextField
            label='Designation'
            type='text'
            error={errors.designation?.message}
            register={register("designation")}
          />
        </div>

        <div className='block'>
          <TextArea
            label='General description'
            error={errors.description?.message}
            register={register("description")}
          />
        </div>

        <div className='py-4 mx-auto flex items-center justify-end md:justify-start md:flex-start space-x-2'>
          <Button
            isLoading={
              drug && drug.id
                ? updateDrugMutation.isLoading
                : createDrugMutation.isLoading
            }
            label={drug && drug.id ? "Update Drug" : "Create Drug"}
          />
        </div>
      </form>
    </>
  );
};

export default DrugForm;
