import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/solid";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { FC, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ICreateInvoiceDTO, IInstitutionDrug, IPatient } from "../../types/pharmacy";
import TextField from "../common/form/TextField";
import Button from "../common/form/Button";
import ComboboxField from "../common/form/ComboboxField";
import { createInvoiceSchema } from "../../utils/schemas/invoice.shema";
import { createInvoice } from "../../apis/invoice";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import Modal from "../common/Modal";
import PatientSelect from "../patients/PatientSelect";
import PatientInvoicesModal from "../patients/PatientInvoicesModal";

type costObject = {
  unitPrice: number;
  quantity: number;
  total: number;
  expireDate: string;
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

  const navigate = useNavigate();

  const [patient, setPatient] = useState<IPatient>();
  const [selectPatientOpen, setSelectPatientOpen] = useState(false);
  const [viewHistory, setViewHistory] = useState(false);

  const createInvoiceMutation = useMutation(createInvoice);

  const [drugsCost, setDrugsCost] = useState<costObject[]>([]);

  const [totalCost, setTotalCost] = useState(0);

  const { append, fields, remove } = useFieldArray({
    control,
    name: "drugs",
  });

  const onSubmit = (data: Partial<ICreateInvoiceDTO>) => {
    createInvoiceMutation.mutate(data as ICreateInvoiceDTO, {
      onSuccess: () => {
        toast.success("Invoice Created");
        fields.forEach((_, index) => remove(index));
        reset();
        navigate("/invoices");
      },
    });
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
        expireDate: format(new Date(selectedDrug?.expireDate || ""), "dd-MM-yyyy"),
      });
    }

    const overallTotal = newCostArray.reduce((accumulator, currentObject) => {
      return accumulator + currentObject.unitPrice * currentObject.quantity;
    }, 0);

    setTotalCost(overallTotal);

    setDrugsCost(newCostArray);
  };

  const changePatient = () => {
    setValue("patientId", patient?.id || "");
    setValue("name", patient?.name || "");
    setValue("phone", patient?.phone || "");
  };

  useEffect(() => {
    if (patient) {
      changePatient();
    }
  }, [patient]);

  return (
    <div className='w-full'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='flex flex-col'>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            <TextField
              type='text'
              value={patient?.patientNO}
              disabled={true}
              label='Patient NO'
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
          <div className='flex space-x-3'>
            <div
              className='py-1 px-2 text-darkblue bg-white cursor-pointer'
              onClick={() => setSelectPatientOpen(true)}
            >
              {patient ? "Change" : "Select"}
            </div>
            {patient && (
              <>
                <div
                  className='py-1 px-2 text-green-500 bg-white cursor-pointer'
                  onClick={() => setViewHistory(true)}
                >
                  View history
                </div>
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
        {patient && viewHistory && (
          <Modal
            isOpen={viewHistory}
            onClose={() => setViewHistory(false)}
            title={`${patient.patientNO} ${patient.name}`}
            big={true}
          >
            <PatientInvoicesModal patientId={patient.id} />
          </Modal>
        )}

        <div className='mt-6'>
          <div className='space-y-2'>
            <table border={1} className='w-full border-spacing-4 border-separate'>
              <thead>
                <tr>
                  <th colSpan={3}>Drug Batch Number</th>
                  <th>Quantity</th>
                  <th>Expire</th>
                  <th>Unit Price</th>
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
                              label: `${drug.batchNumber} ${drug.drug?.designation} : ${drug.quantity}`,
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
                    <td>{drugsCost[index]?.expireDate}</td>
                    <td>{drugsCost[index]?.unitPrice}</td>
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
