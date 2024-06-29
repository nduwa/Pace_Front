import { useMutation } from "@tanstack/react-query";
import PageContent from "../../components/common/PageContent";
import { format } from "date-fns";
import { examination } from "../../apis/forms";
import { IForm, IFormExamRequest } from "../../types/forms";
import SendForm from "../../components/forms/SendForm";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import TextField from "../../components/common/form/TextField";
import Button from "../../components/common/form/Button";
import { FC } from "react";
import OptionsField from "../../components/common/form/OptionsField";
import Protected from "../../components/auth/Protected";
import { examSchema } from "../../utils/schemas/forms.schema";
import Status from "../../components/common/Status";

type props = {
  data: IForm;
};

const FormExamination: FC<props> = ({ data }) => {
  const { id } = data;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Partial<IFormExamRequest>>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      exams: data.exams?.map((i) => {
        const res = i.result ? "true" : "false";
        return {
          examId: i.examId,
          result: i.result === null ? null : res,
          comment: i.comment,
        };
      }),
    },
  });

  const consultationMutation = useMutation(examination);
  const onSubmit = (data: Partial<IFormExamRequest>) => {
    console.log(data);
    data = {
      ...data,
      exams: data.exams?.map((exam) => {
        let result = null;
        if (exam.result == "true") result = true;
        else if (exam.result == "false") result = false;
        else {
          result = null;
        }
        console.log(exam.result, result);

        return {
          ...exam,
          result: result,
        };
      }),
    };
    consultationMutation.mutate({ ...data, id } as IFormExamRequest, {
      onSuccess: () => {
        toast.success("Examination saved");
      },
    });
  };

  return (
    <PageContent
      className='w-full'
      title={`${data?.at} : Form ${data?.formNO}`}
      actionsComponent={<SendForm form={data} reload={true} />}
    >
      <Protected permissions={["LABORATORY"]}>
        <div className='flex flex-col bg-white rounded-md p-8 mb-8'>
          <p className='font-bold text-md mb-2'>{data.patient.name}</p>
          <p className='text-garay-500'>{data.patient.phone}</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col gap-8'>
            <div className='grid lg:grid-cols-3 gap-8'>
              <div className='w-full bg-white p-8 rounded-md lg:col-span-2'>
                {" "}
                {/* You missed the `md` class here */}
                <table className='w-full border-spacing-4 border-separate'>
                  <thead>
                    <tr>
                      <th className='text-left'>Exam</th>
                      <th className='text-left'>Result</th>
                      <th className='text-left'>Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.exams?.map((takenExam, index) => (
                      <tr
                        key={index}
                        className=' border border-dashed border-b rounded-md p-3 my-3'
                      >
                        <td className='px-2'>
                          {takenExam.exam?.exam_code} {takenExam.exam?.name}
                        </td>
                        <td className='px-2'>
                          {takenExam.invoiceId == null && (
                            <OptionsField
                              required
                              error={
                                errors.exams
                                  ? errors.exams[index]?.examId?.message
                                  : undefined
                              }
                              register={register(`exams.${index}.result`)}
                              options={[
                                { label: "Pending", value: "", selected: true },
                                { label: "Positive", value: "true" },
                                { label: "Negative", value: "false" },
                              ]}
                            />
                          )}
                          {takenExam.invoiceId !== null && (
                            <Status
                              status={takenExam?.result}
                              trueText='Positive'
                              falseText='Negative'
                            />
                          )}
                        </td>
                        <td className='px-2'>
                          {takenExam.invoiceId == null && (
                            <TextField
                              type='text'
                              error={
                                errors.exams
                                  ? errors.exams[index]?.examId?.message
                                  : undefined
                              }
                              register={register(`exams.${index}.comment`)}
                            />
                          )}
                          {takenExam.invoiceId !== null && <>{takenExam.comment}</>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className='flex align-right pl-4'>
                  <Button label='Save' isLoading={consultationMutation.isLoading} />
                </div>
              </div>
              <div className='flex flex-col gap-8  justify-between '>
                <div className='bg-white p-8 rounded-md'>
                  <p>Date:{format(new Date(data.createdAt), "dd-MM-yyyy")}</p>
                  <p>Served By: {data.institution?.name}</p>
                  <p>Form NO: {data.formNO}</p>
                  <p>From: {data.from}</p>
                  <p>At: {data.at}</p>
                  {data.patient && (
                    <>
                      <p>PatientNO: {data.patient.patientNO}</p>
                      <p>PatientID: {data.patient.NID}</p>
                      <p>ID Index: {data.patient.NIDIndex}</p>
                    </>
                  )}
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
            </div>
          </div>
        </form>
      </Protected>
    </PageContent>
  );
};

export default FormExamination;
