import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FC } from "react";
import { useMutation } from "@tanstack/react-query";
import { createPurchaseSchema } from "../../utils/schemas/drug.schema";
import { ICreatePurchaseDTO, IDrug } from "../../types/pharmacy";
import { createpurchase } from "../../apis/drug";
import TextField from "../common/form/TextField";
import Button from "../common/form/Button";
import ComboboxField from "../common/form/ComboboxField";

interface IPurchaseFormProps {
  drugs: IDrug[];
}
const PurchaseForm: FC<IPurchaseFormProps> = ({ drugs }) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm<Partial<ICreatePurchaseDTO>>({
    resolver: zodResolver(createPurchaseSchema),
  });

  const createPurchaseMutation = useMutation(createpurchase);

  const { append, fields, remove } = useFieldArray({
    control,
    name: "drugs",
  });

  const onSubmit = (data: Partial<ICreatePurchaseDTO>) => {
    createPurchaseMutation.mutate(data as ICreatePurchaseDTO, {
      onSuccess: () => {
        toast.success("Purchase Created");
        fields.forEach((_, index) => remove(index));
        reset();
      },
    });
  };

  return (
    <div className='w-full'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          <TextField
            error={errors.date?.message}
            label='date'
            type='date'
            register={register("date")}
          />
          <TextField
            error={errors.note?.message}
            label='Small note'
            type='text'
            register={register("note")}
          />
          <TextField
            error={errors.note?.message}
            label='Supplier'
            type='text'
            register={register("supplier")}
          />
        </div>
        <div className='mt-6'>
          <div className='space-y-2'>
            <table border={1} className='w-full'>
              <thead>
                <tr>
                  <th>Drug</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Selling Price</th>
                  <th>_</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((_item, index) => (
                  <tr key={index}>
                    <td>
                      <ComboboxField
                        options={drugs.map((drug) => ({
                          value: drug.id,
                          label: `${drug.drug_code} ${drug.designation}`,
                        }))}
                        error={
                          errors.drugs
                            ? errors.drugs[index]?.drug?.message
                            : undefined
                        }
                        onChange={(value: string) =>
                          setValue(`drugs.${index}.drug`, value)
                        }
                      />
                    </td>
                    <td>
                      <TextField
                        type='number'
                        error={
                          errors.drugs
                            ? errors.drugs[index]?.qty?.message
                            : undefined
                        }
                        register={register(`drugs.${index}.qty`)}
                      />
                    </td>
                    <td>
                      <TextField
                        type='number'
                        error={
                          errors.drugs
                            ? errors.drugs[index]?.unitPrice?.message
                            : undefined
                        }
                        register={register(`drugs.${index}.unitPrice`)}
                      />
                    </td>
                    <td>
                      <TextField
                        type='number'
                        error={
                          errors.drugs
                            ? errors.drugs[index]?.sellingPrice?.message
                            : undefined
                        }
                        register={register(`drugs.${index}.sellingPrice`)}
                      />
                    </td>
                    <td>
                      <TrashIcon
                        onClick={() => remove(index)}
                        className=' w-4 text-red-500 cursor-pointer ml-5'
                      />
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={4}>
                    <PlusCircleIcon
                      onClick={() =>
                        append({ drug: "", qty: 1, unitPrice: 1, sellingPrice: 1 })
                      }
                      className='w-5 text-dark-green font-bold cursor-pointer'
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan={4}>
                    <span className='text-red-500'>
                      {errors.drugs?.root?.message}
                    </span>
                  </td>
                </tr>
                {fields[0] && (
                  <tr>
                    <td colSpan={4}>
                      <Button
                        label='Save'
                        isLoading={createPurchaseMutation.isLoading}
                        className='mt-4'
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PurchaseForm;