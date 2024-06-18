import { useMutation, useQuery } from "@tanstack/react-query";
import PageContent from "../../components/common/PageContent";
import { format } from "date-fns";
import { makeInvoice, saveInvoice } from "../../apis/forms";
import { IForm, IFormInvoiceData, IFormInvoiceRequest } from "../../types/forms";
import SendForm from "../../components/forms/SendForm";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { formInvoiceRequestSchema } from "../../utils/schemas/forms.schema";
import { useForm } from "react-hook-form";
import TextField from "../../components/common/form/TextField";
import { FC } from "react";
import Protected from "../../components/auth/Protected";
import { FORM_INVOICE } from "../../utils/constants/queryKeys";
import Button from "../../components/common/form/Button";
import { useLocation, useNavigate } from "react-router-dom";

type props = {
  data: IForm;
};

type mainProps = {
  data: IForm;
  invoiceData: IFormInvoiceData;
};

const FormInvoicingBody: FC<mainProps> = ({ invoiceData }) => {
  let totalCost = 0;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<IFormInvoiceRequest>>({
    resolver: zodResolver(formInvoiceRequestSchema),
    defaultValues: {
      invoiceExams: invoiceData.invoiceExams.map((i) => {
        totalCost += i.price;
        return { id: i.id, price: i.price };
      }),
      invoiceConsultations: invoiceData.invoiceConsultations.map((i) => {
        totalCost += i.price;
        return { id: i.id, price: i.price };
      }),
      invoiceDrugs: invoiceData.invoiceDrugs.map((i) => {
        totalCost += i.totalPrice;
        return {
          id: i.id,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          totalPrice: i.totalPrice,
        };
      }),
    },
  });

  const location = useLocation();
  const navigation = useNavigate();

  const saveInvoiceMutation = useMutation(saveInvoice);

  const onSubmit = (data: Partial<IFormInvoiceRequest>) => {
    saveInvoiceMutation.mutate(
      { ...data, id: invoiceData.invoice.id } as IFormInvoiceRequest,
      {
        onSuccess: () => {
          toast.success("Invoice saved");
          navigation(location.pathname, { replace: true });
        },
      },
    );
  };

  console.log(errors);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex justify-between bg-white p-8 mt-6 rounded-md'
    >
      <div className='flex flex-col gap-8'>
        <div className='w-full bg-white p-8 rounded md'>
          <div className='flex space-x-3 items-center'>
            <div className='items-center flex '>
              <div className='py-2 px-3 bg-gray-100 mt-4'>{totalCost} RWF</div>
            </div>

            <Button
              label='Save'
              isLoading={saveInvoiceMutation.isLoading}
              className='mt-4'
            />
          </div>
          <table className='w-full border-spacing-4 border border-1 border-separate'>
            <thead>
              <tr>
                <th className='text-left'>Item</th>
                <th className='text-left'>UnitPrice</th>
                <th className='text-left'>Quantity</th>
                <th className='text-left'>TotalPrice</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='bg-gray-100 px-2 py-1' colSpan={4}>
                  DRUGS
                </td>
              </tr>
              {invoiceData.invoiceDrugs.length === 0 && (
                <tr>
                  <td colSpan={4}>0 drugs</td>
                </tr>
              )}
              {invoiceData.invoiceDrugs.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className=' border border-dashed border-b rounded-md p-3 my-3'
                  >
                    <td className='px-2'>
                      <div className='flex flex-col space-y-4'>
                        <div className='w-full'>
                          <div className='hidden'>
                            <TextField
                              disabled={true}
                              register={register(`invoiceDrugs.${index}.id`)}
                              type='text'
                            />
                          </div>
                          {item.drug.drug_code} ${item.drug.designation}
                        </div>
                      </div>
                    </td>
                    <td className='px-2'>
                      <TextField
                        disabled={true}
                        register={register(`invoiceDrugs.${index}.unitPrice`)}
                        type='number'
                      />
                    </td>
                    <td className='px-2'>
                      <TextField
                        disabled={true}
                        register={register(`invoiceDrugs.${index}.quantity`)}
                        type='number'
                      />
                    </td>
                    <td className='px-2'>
                      <TextField
                        disabled={true}
                        register={register(`invoiceDrugs.${index}.totalPrice`)}
                        type='number'
                      />
                    </td>
                  </tr>
                );
              })}

              <tr>
                <td className='bg-gray-100 px-2 py-1' colSpan={4}>
                  {" "}
                  EXAMS
                </td>
              </tr>
              {invoiceData.invoiceExams.length === 0 && (
                <tr>
                  <td colSpan={4}>0 exams</td>
                </tr>
              )}
              {invoiceData.invoiceExams.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className=' border border-dashed border-b rounded-md p-3 my-3'
                  >
                    <td className='px-2'>
                      <div className='flex flex-col space-y-4'>
                        <div className='w-full'>
                          <div className='hidden'>
                            <TextField
                              disabled={true}
                              register={register(`invoiceExams.${index}.id`)}
                              type='text'
                            />
                          </div>
                          {item.exam?.exam_code} {item.exam?.name}
                        </div>
                      </div>
                    </td>
                    <td className='px-2'>
                      <TextField
                        disabled={true}
                        register={register(`invoiceExams.${index}.price`)}
                        type='number'
                      />
                    </td>
                    <td className='px-2'>1</td>
                    <td className='px-2'>
                      <TextField
                        disabled={true}
                        register={register(`invoiceExams.${index}.price`)}
                        type='number'
                      />
                    </td>
                  </tr>
                );
              })}

              <tr>
                <td className='bg-gray-100 px-2 py-1' colSpan={4}>
                  CONSULTATIONS
                </td>
              </tr>
              {invoiceData.invoiceConsultations.length === 0 && (
                <tr>
                  <td colSpan={4}>0 consultations</td>
                </tr>
              )}
              {invoiceData.invoiceConsultations.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className=' border border-dashed border-b rounded-md p-3 my-3'
                  >
                    <td className='px-2'>
                      <div className='flex flex-col space-y-4'>
                        <div className='w-full'>
                          <div className='hidden'>
                            <TextField
                              disabled={true}
                              register={register(`invoiceConsultations.${index}.id`)}
                              type='text'
                            />
                          </div>
                          {item.consultation?.label}
                        </div>
                      </div>
                    </td>
                    <td className='px-2'>
                      <TextField
                        disabled={true}
                        register={register(`invoiceConsultations.${index}.price`)}
                        type='number'
                      />
                    </td>
                    <td className='px-2'>1</td>
                    <td className='px-2'>
                      <TextField
                        disabled={true}
                        register={register(`invoiceConsultations.${index}.price`)}
                        type='number'
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </form>
  );
};

const FormInvoicing: FC<props> = ({ data }) => {
  const { data: invoiceData } = useQuery({
    queryKey: FORM_INVOICE,
    queryFn: () => makeInvoice(data.id),
  });

  return (
    <PageContent className='w-full' title={`Consultation ${data?.formNO}`}>
      <Protected permissions={["CONSULTATION"]}>
        <div className='grid md:grid-cols-2 gap-8'>
          <div className='flex justify-between bg-white p-8 rounded-md'>
            <div>
              <p>Date:{format(new Date(data.createdAt), "dd-MM-yyyy")}</p>
              <p>Served By: {data.institution?.name}</p>
              <p>Form NO: {data.formNO}</p>
              <p>At: {data.at}</p>
              {data.patient && (
                <>
                  <p>PatientNO: {data.patient.patientNO}</p>
                  <p>PatientID: {data.patient.NID}</p>
                  <p>ID Index: {data.patient.NIDIndex}</p>
                </>
              )}
              <div className='flex align-right'>
                <SendForm form={data} reload={true} />
              </div>
            </div>
          </div>
          <div className='w-full bg-white p-8 rounded-md'>
            <div className='block'>
              <div className='flex flex-col gap-6'>
                {data.consultations?.map((consultation, index) => (
                  <div key={index}>
                    <div className='font-bold'>
                      {consultation.consultation.label}
                    </div>
                    <div className='text-gray-600 text-sm'>
                      {consultation.verdict}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {invoiceData && <FormInvoicingBody data={data} invoiceData={invoiceData} />}
      </Protected>
    </PageContent>
  );
};

export default FormInvoicing;
