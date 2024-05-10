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
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

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
        navigate("/drugs/orders");
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
            <table border={1} className='w-full border-spacing-4 border-separate'>
              <thead>
                <tr>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Selling Price</th>
                  <th>BN/Expiry</th>
                  <th>_</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((_item, index) => (
                  <tr
                    key={index}
                    className=' border border-dashed border-b rounded-md p-3 my-3'
                  >
                    <td colSpan={3} className='p-4'>
                      <div className='flex flex-col space-y-4'>
                        <div className='w-full'>
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
                        </div>
                        <div className='w-full flex space-x-4'>
                          <TextField
                            type='number'
                            error={
                              errors.drugs
                                ? errors.drugs[index]?.qty?.message
                                : undefined
                            }
                            register={register(`drugs.${index}.qty`)}
                          />
                          <TextField
                            type='number'
                            error={
                              errors.drugs
                                ? errors.drugs[index]?.unitPrice?.message
                                : undefined
                            }
                            register={register(`drugs.${index}.unitPrice`)}
                          />
                          <TextField
                            type='number'
                            error={
                              errors.drugs
                                ? errors.drugs[index]?.sellingPrice?.message
                                : undefined
                            }
                            register={register(`drugs.${index}.sellingPrice`)}
                          />
                        </div>
                      </div>
                    </td>
                    <td className='p-4'>
                      <div className='flex flex-col space-y-2'>
                        <TextField
                          type='text'
                          error={
                            errors.drugs
                              ? errors.drugs[index]?.batchNumber?.message
                              : undefined
                          }
                          register={register(`drugs.${index}.batchNumber`)}
                        />
                        <TextField
                          type='date'
                          error={
                            errors.drugs
                              ? errors.drugs[index]?.expireDate?.message
                              : undefined
                          }
                          register={register(`drugs.${index}.expireDate`)}
                        />
                      </div>
                    </td>

                    <td className='p-4'>
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
                        append({
                          drug: "",
                          qty: 1,
                          unitPrice: 1,
                          sellingPrice: 1,
                          batchNumber: "",
                          expireDate: "",
                        })
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
