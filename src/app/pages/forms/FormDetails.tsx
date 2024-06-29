import PageContent from "../../components/common/PageContent";
import { format } from "date-fns";
import { IForm } from "../../types/forms";
import SendForm from "../../components/forms/SendForm";
import { FC } from "react";
import Status from "../../components/common/Status";

type props = {
  data: IForm;
};

const FormDetails: FC<props> = ({ data }) => {
  return (
    <PageContent
      className='w-full'
      title={`${data?.at} : Form ${data?.formNO}`}
      actionsComponent={<SendForm form={data} reload={true} />}
    >
      <div className='flex flex-col gap-8'>
        <div className='grid md:grid-cols-2 gap-8'>
          <div className='flex justify-between bg-white p-8 rounded-md'>
            <div>
              {" "}
              <p>Date:{format(new Date(data.createdAt), "dd-MM-yyyy")}</p>
              <p>Served By: {data.institution?.name}</p>
              <p>Form NO: {data.formNO}</p>
              <p className='mt-2'>From: {data.from}</p>
              {data.patient && (
                <>
                  <p>PatientNO: {data.patient.patientNO}</p>
                  <p>PatientID: {data.patient.NID}</p>
                  <p>ID Index: {data.patient.NIDIndex}</p>
                </>
              )}
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
              <p></p>
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
              </tr>
            </thead>
            <tbody>
              {data.exams?.map((takenExam, index) => {
                return (
                  <tr
                    key={index}
                    className=' border border-dashed border-b rounded-md p-3 my-3'
                  >
                    <td className='px-2'>
                      {takenExam.exam?.exam_code} {takenExam.exam?.name}
                    </td>
                    <td className='px-2'>
                      <Status
                        status={takenExam?.result}
                        trueText='Positive'
                        falseText='Negative'
                      />
                    </td>
                    <td className='px-2'>{takenExam?.comment}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className='w-full bg-white rounded-md p-8'>
          <table className='w-full border-spacing-4 border-separate'>
            <thead>
              <tr>
                <th className='text-left'>Drug</th>
                <th className='text-left'>Quantity</th>
                <th className='text-left'>Given</th>
                <th className='text-left'>Prescription</th>
              </tr>
            </thead>
            <tbody>
              {data.drugs?.map((takenDrug, index) => {
                return (
                  <tr
                    key={index}
                    className=' border border-dashed border-b rounded-md p-3 my-3'
                  >
                    <td className='px-2'>
                      {takenDrug.drug?.drug_code} {takenDrug.drug?.designation}
                    </td>
                    <td className='px-2'>{takenDrug.quantity}</td>
                    <td className='px-2'>{takenDrug.givenQuantity}</td>
                    <td className='px-2'>{takenDrug.prescription}</td>
                    <td className='px-2'>
                      <Status
                        status={takenDrug.givenQuantity == takenDrug.quantity}
                        trueText='Given'
                        falseText='Not yet'
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PageContent>
  );
};

export default FormDetails;
