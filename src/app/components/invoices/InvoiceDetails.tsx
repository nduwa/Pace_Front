import { FC } from "react";
import { IInvoice } from "../../types/pharmacy";
import { format } from "date-fns";

interface IProps {
  data: IInvoice;
  closeDrawer?: () => void;
}
const InvoiceDetails: FC<IProps> = ({ data }) => {
  return (
    <div className='relative'>
      <div className='w-full relative'>
        <div className='flex flex-col space-y-2 mb-6'>
          <p>Date:{format(new Date(data.createdAt), "dd-MM-yyyy")}</p>
          <p>Served By: {data.user?.name}</p>
          <p>Branch: {data.institution?.parentInstitution?.name || "Main"}</p>
          <p>Invoice NO: {data.invoiceNO}</p>
          <p>Name: {data.name}</p>
          <p>Phone: {data.phone}</p>
          {data.patient && (
            <>
              <p>PatientNO: {data.patient.patientNO}</p>
              <p>PatientID: {data.patient.NID}</p>
              <p>ID Index: {data.patient.NIDIndex}</p>
            </>
          )}
        </div>
        <table cellPadding={2} className='w-full'>
          <thead>
            <tr>
              <th>#{data.invoiceNO}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data?.drugs?.map((drug) => (
              <tr key={drug.id} className='border'>
                <td className='px-1.5 py-2'>{drug.drug?.designation}</td>
                <td className='px-1.5 py-2'>{drug.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceDetails;
