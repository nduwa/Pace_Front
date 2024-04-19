import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, FC, SetStateAction } from "react";
import toast from "react-hot-toast";
import { createDrugCategory, updateDrugCategory } from "../../apis/drug";
import {
  DRUGS_CATEGORIES,
  DRUG_CATEGORIS_NPAGED,
} from "../../utils/constants/queryKeys";
import TextField from "../common/form/TextField";
import Button from "../common/form/Button";
import { IDrugCategory, IDrugCategoryRequest } from "../../types/pharmacy";
import { drugCategorySchema } from "../../utils/schemas/drug.schema";

interface IDrugCategoryForm {
  category?: IDrugCategory;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const DrugCategoryForm: FC<IDrugCategoryForm> = ({ category, setIsOpen }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IDrugCategoryRequest>({
    resolver: zodResolver(drugCategorySchema),
    defaultValues: {
      ...category,
    },
  });

  const createMutation = useMutation(createDrugCategory);
  const updateMutation = useMutation(updateDrugCategory);

  const onSubmit = (data: IDrugCategoryRequest) => {
    if (category && category.id) {
      updateMutation.mutate({ id: category.id, ...data } as IDrugCategoryRequest, {
        onSuccess() {
          toast.success("Drug updated successfully");
          setIsOpen(false);
          queryClient.invalidateQueries(DRUG_CATEGORIS_NPAGED);
          queryClient.invalidateQueries(DRUGS_CATEGORIES);
          reset();
        },
      });
    } else {
      createMutation.mutate(data, {
        onSuccess() {
          toast.success("Drug created successfully");
          setIsOpen(false);
          queryClient.invalidateQueries(DRUG_CATEGORIS_NPAGED);
          queryClient.invalidateQueries(DRUGS_CATEGORIES);
          reset();
        },
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='flex gap-4 flex-col'>
        <div className='grid'>
          <div className='block'>
            <TextField
              label='Name'
              type='text'
              error={errors.name?.message}
              register={register("name")}
            />
          </div>
        </div>
        <div className='py-4 mx-auto flex items-center justify-end md:justify-start md:flex-start space-x-2'>
          <Button
            isLoading={
              category && category.id
                ? updateMutation.isLoading
                : createMutation.isLoading
            }
            label={category && category.id ? "Update Category" : "Create Category"}
          />
        </div>
      </form>
    </>
  );
};

export default DrugCategoryForm;
