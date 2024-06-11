import { useMutation } from "@tanstack/react-query";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import PageContent from "../../components/common/PageContent";
import { format } from "date-fns";
import { consultation } from "../../apis/forms";
import {
  IForm,
  IFormConsultation,
  IFormConsultationRequest,
} from "../../types/forms";
import SendForm from "../../components/forms/SendForm";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { consultationSchema } from "../../utils/schemas/forms.schema";
import { useFieldArray, useForm } from "react-hook-form";
import TextArea from "../../components/common/form/TextArea";
import ComboboxField from "../../components/common/form/ComboboxField";
import TextField from "../../components/common/form/TextField";
import Button from "../../components/common/form/Button";
import { FC, useEffect, useState } from "react";
import { IExam } from "../../types/exams";
import { IDrug } from "../../types/pharmacy";
import Status from "../../components/common/Status";
import Protected from "../../components/auth/Protected";

type props = {
  data: IForm;
  exams: IExam[];
  drugs: IDrug[];
};

const FormConsultation: FC<props> = ({ data, exams, drugs }) => {
  const { id } = data;
  const examIds = data.exams?.map((ex) => ex.examId) || [];
  const drugIds = data.drugs?.map((drug) => drug.drugId) || [];
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<Partial<IFormConsultationRequest>>({
    resolver: zodResolver(consultationSchema),
    defaultValues: { ...data },
  });

  const {
    append: examsAppend,
    fields: examFields,
    remove: examsRemove,
  } = useFieldArray({
    control,
    name: "exams",
  });

  const {
    append: drugsAppend,
    fields: drugFields,
    remove: drugsRemove,
  } = useFieldArray({
    control,
    name: "drugs",
  });

  const consultationMutation = useMutation(consultation);
  const onSubmit = (data: Partial<IFormConsultationRequest>) => {
    consultationMutation.mutate({ ...data, id } as IFormConsultationRequest, {
      onSuccess: () => {
        toast.success("Consultation saved");
      },
    });
  };

  const [isUpdatable, setIsUpdatable] = useState<boolean>();

  useEffect(() => {
    if (isUpdatable == undefined && data) {
      const consultations: IFormConsultation[] = data.consultations || [];
      const consultation = consultations.find(
        (cons) => cons.consultation.label == data.at,
      );

      setIsUpdatable(consultation !== undefined && data?.isOpen === true);
      setValue("consultationId", consultation?.consultationId || "");
      setValue("verdict", consultation?.verdict || "");
    }
  }, [data]);
  return (
    <PageContent className='w-full' title={`Consultation ${data?.formNO}`}>
      <Protected permissions={["CONSULTATION"]}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {isUpdatable === true && (
            <div className='flex flex-col gap-8'>
              <div className='grid md:grid-cols-2 gap-8'>
                <div className='flex justify-between bg-white p-8 rounded-md'>
                  <div>
                    {" "}
                    <p>Date:{format(new Date(data.createdAt), "dd-MM-yyyy")}</p>
                    <p>Served By: {data.institution?.name}</p>
                    <p>Form NO: {data.formNO}</p>
                    {data.patient && (
                      <>
                        <p>PatientNO: {data.patient.patientNO}</p>
                        <p>PatientID: {data.patient.NID}</p>
                        <p>ID Index: {data.patient.NIDIndex}</p>
                      </>
                    )}
                    <div className='flex align-right'>
                      <SendForm form={data} reload={true} />
                      {isUpdatable && (
                        <Button
                          label='Save'
                          isLoading={consultationMutation.isLoading}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className='w-full bg-white p-8 rounded-md'>
                  <div className='flex flex-col gap-6'>
                    {data.consultations?.map((consultation, index) => (
                      <div key={index}>
                        <div className='font-bold'>
                          {consultation.consultation.label}
                        </div>

                        {consultation.consultation.label === data.at && (
                          <TextArea
                            error={errors.verdict?.message}
                            label='Verdict'
                            disabled={!isUpdatable}
                            register={register("verdict")}
                          />
                        )}
                        {consultation.consultation.label !== data.at && (
                          <div className='text-gray-600 text-sm'>
                            {consultation.verdict}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className='w-full bg-white p-8 rounded md'>
                <table className='w-full border-spacing-4 border-separate'>
                  <thead>
                    <tr>
                      <th className='text-left'>Exam</th>
                      <th className='text-left'>Result</th>
                      <th className='text-left'>Comment</th>
                      <th className='text-left'>_</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examFields.map((_item, index) => {
                      const takenExam = examIds[index]
                        ? data.exams?.find((exam) => exam.examId === examIds[index])
                        : undefined;
                      return (
                        <tr
                          key={index}
                          className=' border border-dashed border-b rounded-md p-3 my-3'
                        >
                          <td className='px-2'>
                            <div className='flex flex-col space-y-4'>
                              <div className='w-full'>
                                {exams && (
                                  <ComboboxField
                                    options={
                                      (typeof examIds[index] == "string"
                                        ? exams.filter(
                                            (exam) => exam.id === examIds[index],
                                          )
                                        : exams
                                      )?.map((exam) => ({
                                        value: exam.id,
                                        label: `${exam.exam_code} ${exam?.name}`,
                                      })) || []
                                    }
                                    error={
                                      errors.exams
                                        ? errors.exams[index]?.examId?.message
                                        : undefined
                                    }
                                    defaultValue={examIds[index]}
                                    onChange={(value: string) => {
                                      setValue(`exams.${index}.examId`, value);
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          </td>
                          <td className='px-2'>
                            <Status
                              status={
                                takenExam === undefined ? null : takenExam.result
                              }
                              trueText='Positive'
                              falseText='Negative'
                            />
                          </td>
                          <td className='px-2'>{takenExam?.comment}</td>

                          <td className='px-2'>
                            {(!takenExam || takenExam.result === null) && (
                              <TrashIcon
                                onClick={() => examsRemove(index)}
                                className=' w-4 text-red-500 cursor-pointer ml-5'
                              />
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td colSpan={4}>
                        <div
                          className='text-dark-green p-1 cursor-pointer flex gap-2'
                          onClick={() =>
                            examsAppend({
                              examId: "",
                            })
                          }
                        >
                          <PlusCircleIcon className='w-5 text-dark-green font-bold cursor-pointer' />
                          Add
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className='w-full bg-white rounded-md p-8'>
                <table className='w-full border-spacing-4 border-separate'>
                  <thead>
                    <tr>
                      <th className='text-left'>Drug</th>
                      <th className='text-left'>Quantity</th>
                      <th className='text-left'>Prescription</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drugFields.map((_item, index) => {
                      const takenDrug = drugIds[index]
                        ? data.drugs?.find((drug) => drug.drugId === drugIds[index])
                        : undefined;
                      return (
                        <tr
                          key={index}
                          className=' border border-dashed border-b rounded-md p-3 my-3'
                        >
                          <td className='px-2'>
                            <div className='flex flex-col space-y-4'>
                              <div className='w-full'>
                                {drugs && (
                                  <ComboboxField
                                    options={
                                      (typeof drugIds[index] == "string"
                                        ? drugs.filter(
                                            (drug) => drug.id === drugIds[index],
                                          )
                                        : drugs
                                      )?.map((drug) => ({
                                        value: drug.id,
                                        label: `${drug.drug_code} ${drug?.designation}`,
                                      })) || []
                                    }
                                    error={
                                      errors.drugs
                                        ? errors.drugs[index]?.drugId?.message
                                        : undefined
                                    }
                                    defaultValue={drugIds[index]}
                                    onChange={(value: string) => {
                                      setValue(`drugs.${index}.drugId`, value);
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          </td>
                          <td className='px-2'>
                            <TextField
                              type='number'
                              allowFloats={true}
                              error={
                                errors.drugs
                                  ? errors.drugs[index]?.quantity?.message
                                  : undefined
                              }
                              register={register(`drugs.${index}.quantity`)}
                              onValueChage={(value: string) => {
                                setValue(`drugs.${index}.quantity`, parseInt(value));
                              }}
                            />
                          </td>
                          <td className='px-2'>
                            <TextField
                              type='text'
                              error={
                                errors.drugs
                                  ? errors.drugs[index]?.prescription?.message
                                  : undefined
                              }
                              register={register(`drugs.${index}.prescription`)}
                              onValueChage={(value: string) => {
                                setValue(`drugs.${index}.prescription`, value);
                              }}
                            />
                          </td>
                          <td className='px-2'>
                            {(!takenDrug || takenDrug.invoiceId == null) && (
                              <TrashIcon
                                onClick={() => drugsRemove(index)}
                                className=' w-4 text-red-500 cursor-pointer ml-5'
                              />
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td colSpan={4}>
                        <div
                          className='text-dark-green p-1 cursor-pointer flex gap-2'
                          onClick={() =>
                            drugsAppend({
                              drugId: "",
                              quantity: 1,
                              prescription: "",
                            })
                          }
                        >
                          <PlusCircleIcon className='w-5 text-dark-green font-bold cursor-pointer' />
                          Add
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </form>
      </Protected>
    </PageContent>
  );
};

export default FormConsultation;
