import ReactDOM from "react-dom";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FC, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ICreateInvoiceDTO, IInstitutionDrug, IInvoice } from "../../types/pharmacy";
import TextField from "../common/form/TextField";
import Button from "../common/form/Button";
import ComboboxField from "../common/form/ComboboxField";
import { createInvoiceSchema } from "../../utils/schemas/invoice.shema";
import { createInvoice } from "../../apis/invoice";
import { getpatients } from "../../apis/patients";
import { PATIENTS_NPAGED } from "../../utils/constants/queryKeys";
import InvoiceDetailsComponent from "./InvoiceDetailsComponent";

type costObject = {
  unitPrice: number;
  quantity: number;
  total: number;
};

interface IInvoiceFormProps {
  drugs: IInstitutionDrug[];
}
const InvoiceForm: FC<IInvoiceFormProps> = ({ drugs }) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm<Partial<ICreateInvoiceDTO>>({
    resolver: zodResolver(createInvoiceSchema),
  });

  const openPrintableInvoice = (invoice: IInvoice) => {
    const newWindow = window.open("", "_blank") as Window;
    newWindow.document.write(
      "<html><head><title>Printable Invoice</title></head><body>",
    );
    newWindow.document.write('<div id="printableInvoice"></div>');
    newWindow.document.write("</body></html>");
    newWindow.document.close();

    const printableInvoiceDiv =
      newWindow.document.getElementById("printableInvoice");
    ReactDOM.render(
      <InvoiceDetailsComponent invoice={invoice} />,
      printableInvoiceDiv,
    );
  };

  const createInvoiceMutation = useMutation(createInvoice);

  const [drugsCost, setDrugsCost] = useState<costObject[]>([]);

  const [totalCost, setTotalCost] = useState(0);

  const { append, fields, remove } = useFieldArray({
    control,
    name: "drugs",
  });

  const { data: patients } = useQuery({
    queryFn: getpatients,
    queryKey: PATIENTS_NPAGED,
  });

  const onSubmit = (data: Partial<ICreateInvoiceDTO>) => {
    createInvoiceMutation.mutate(data as ICreateInvoiceDTO, {
      onSuccess: (invoice: IInvoice) => {
        toast.success("Invoice Created");
        openPrintableInvoice(invoice);
        fields.forEach((_, index) => remove(index));
        reset();
      },
    });
  };

  const changePatient = (value: string) => {
    setValue("patientId", value);
    const patient = patients?.find((p) => p.id === value);
    setValue("name", patient?.name || "");
    setValue("phone", patient?.phone || "");
  };

  const changeCosts = () => {
    const newCostArray: costObject[] = [];
    for (let i = 0; i < fields.length; i++) {
      const drug = getValues(`drugs.${i}`);
      const selectedDrug = drugs.find((d) => d.id === drug.drug);
      const unitPrice = selectedDrug?.price || 0;
      const quantity = drug.qty;
      const cost = unitPrice * quantity;
      newCostArray.push({
        unitPrice,
        total: isNaN(cost) ? 0 : cost,
        quantity: drug.qty,
      });
    }

    const overallTotal = newCostArray.reduce((accumulator, currentObject) => {
      return accumulator + currentObject.unitPrice * currentObject.quantity;
    }, 0);

    setTotalCost(overallTotal);

    setDrugsCost(newCostArray);
  };

  return (
    <div className='w-full'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          <ComboboxField
            label='Patient  (optional)'
            options={
              patients?.map((patient) => ({
                value: patient.id,
                label: `${patient.patientNO}: ${patient.name} ${patient.NID}`,
              })) || []
            }
            error={errors.patientId?.message}
            onChange={changePatient}
          />
          <TextField
            error={errors.name?.message}
            label='Name'
            type='text'
            register={register("name")}
          />
          <TextField
            error={errors.phone?.message}
            label='Phone'
            type='text'
            register={register("phone")}
          />
        </div>
        <div className='mt-6'>
          <div className='space-y-2'>
            <table border={1} className='w-full border-spacing-4 border-separate'>
              <thead>
                <tr>
                  <th colSpan={3}>Drug Batch Number</th>
                  <th>Quantity</th>
                  <th>SubTotal</th>
                  <th>_</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((_item, index) => (
                  <tr
                    key={index}
                    className=' border border-dashed border-b rounded-md p-3 my-3'
                  >
                    <td colSpan={3} className='px-2'>
                      <div className='flex flex-col space-y-4'>
                        <div className='w-full'>
                          <ComboboxField
                            options={drugs.map((drug) => ({
                              value: drug.id,
                              label: `${drug.batchNumber} ~~ ${drug.drug?.designation} ~~ ${drug.totalQuantity}`,
                            }))}
                            error={
                              errors.drugs
                                ? errors.drugs[index]?.drug?.message
                                : undefined
                            }
                            onChange={(value: string) => {
                              setValue(`drugs.${index}.drug`, value);
                              changeCosts();
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className='px-2'>
                      <TextField
                        type='number'
                        allowFloats={true}
                        error={
                          errors.drugs
                            ? errors.drugs[index]?.qty?.message
                            : undefined
                        }
                        register={register(`drugs.${index}.qty`)}
                        onValueChage={(value: string) => {
                          setValue(`drugs.${index}.qty`, parseInt(value));
                          changeCosts();
                        }}
                      />
                    </td>
                    <td>{drugsCost[index]?.total} RWF</td>

                    <td className='px-2'>
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
                  <>
                    <tr>
                      <td colSpan={4}>
                        <div className='flex space-x-3 items-center'>
                          <div className='items-center flex '>
                            <div className='py-2 px-3 bg-gray-100 mt-4'>
                              {totalCost} RWF
                            </div>
                          </div>

                          <Button
                            label='Save'
                            isLoading={createInvoiceMutation.isLoading}
                            className='mt-4'
                          />
                        </div>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
