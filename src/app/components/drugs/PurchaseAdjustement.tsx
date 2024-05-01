import { FC, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { SyncLoader } from "react-spinners";
import { adjustDrugs, getDrugsByPruchase } from "../../apis/drug";
import { PURCHASE_DRUGS } from "../../utils/constants/queryKeys";
import { purchaseDrugsSchema } from "../../utils/schemas/drug.schema";
import { IAdjustPurchaseDTO, IDrugPurchase } from "../../types/pharmacy";
import { format } from "date-fns";

interface IProps {
  data: IDrugPurchase;
  closeDrawer?: () => void;
}
const PurchaseAdjustement: FC<IProps> = ({ data, closeDrawer }) => {
  const buttonRef = useRef(null);
  const {
    data: drugs,
    isLoading,
    isFetching,
  } = useQuery({
    queryFn: () => getDrugsByPruchase(data.id),
    queryKey: PURCHASE_DRUGS,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAdjustPurchaseDTO>({
    resolver: zodResolver(purchaseDrugsSchema),
  });

  const itemsAdjustmentMutation = useMutation(adjustDrugs);
  const queryClient = useQueryClient();

  const onSubmit = (data: IAdjustPurchaseDTO) => {
    itemsAdjustmentMutation.mutate(data, {
      onSuccess: () => {
        toast.success("Adjustments saved");
        queryClient.invalidateQueries(PURCHASE_DRUGS);

        closeDrawer && closeDrawer();
      },
    });
  };

  return (
    <div className='relative'>
      {(isLoading || isFetching) && (
        <div className='flex justify-center mb-3'>
          <SyncLoader color='#6DAB3C' />
        </div>
      )}
      {!isLoading && !isFetching && drugs && (
        <div className='w-full relative'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <table cellPadding={2} className='w-full'>
              <thead>
                <tr>
                  <th>NO</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {drugs.map((drug, index) => (
                  <tr key={drug.id} className='border'>
                    <td>
                      {drug.itemNo}

                      <input
                        placeholder=''
                        className='p-2 outline-none'
                        value={drug.id}
                        type='hidden'
                        {...register(`drugs.${index}.id`)}
                      />
                    </td>
                    <td>
                      <input
                        placeholder='Batch Number'
                        className='p-2 outline-none'
                        defaultValue={drug.batchNumber || ""}
                        {...register(`drugs.${index}.batchNumber`)}
                      />
                    </td>
                    <td>
                      <input
                        placeholder='Expiry Date'
                        className='p-2 outline-none'
                        type='date'
                        defaultValue={
                          format(new Date(drug.expireDate || ""), "yyyy-MM-dd") || ""
                        }
                        {...register(`drugs.${index}.expireDate`)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='space-y-4 mt-4'>
              <div className='text-red-500 text-sm'>
                {errors.drugs?.root?.message}
              </div>
              <button
                ref={buttonRef}
                type='submit'
                className='rounded bg-green text-white hover:bg-dark-green px-4 py-2'
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PurchaseAdjustement;
