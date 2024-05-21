import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, FC, SetStateAction } from "react";
import toast from "react-hot-toast";
import { updateDrugPrice } from "../../apis/drug";
import {
  INSTITUTION_DRUGS_GROUPED,
  INSTITUTION_DRUGS_NPAGED,
} from "../../utils/constants/queryKeys";
import TextField from "../common/form/TextField";
import Button from "../common/form/Button";
import { IInstitutionDrug, IPriceChange } from "../../types/pharmacy";
import { priceSchema } from "../../utils/schemas/drug.schema";

interface IDrugUpdateForm {
  drug: IInstitutionDrug;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const DrugPriceForm: FC<IDrugUpdateForm> = ({ drug, setIsOpen }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IPriceChange>({
    resolver: zodResolver(priceSchema),
    defaultValues: {
      ...drug,
    },
  });

  const priceMutation = useMutation(updateDrugPrice);

  const onSubmit = (data: IPriceChange) => {
    priceMutation.mutate({ id: drug.drugId, ...data } as IPriceChange, {
      onSuccess() {
        toast.success("Price updated successfully");
        setIsOpen(false);
        queryClient.invalidateQueries(INSTITUTION_DRUGS_GROUPED);
        queryClient.invalidateQueries(INSTITUTION_DRUGS_NPAGED);
        setIsOpen(false);
      },
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='flex gap-4 flex-col'>
        <div className='grid'>
          <div className='block'>
            <TextField
              label='Price'
              type='text'
              error={errors.price?.message}
              register={register("price")}
            />
          </div>
        </div>

        <div className='py-4 mx-auto flex items-center justify-end md:justify-start md:flex-start space-x-2'>
          <Button isLoading={priceMutation.isLoading} label={"Update Price"} />
        </div>
      </form>
    </>
  );
};

export default DrugPriceForm;
