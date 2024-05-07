import ReactDOM from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import PageContent from "../../components/common/PageContent";
import { PURCHASE } from "../../utils/constants/queryKeys";
import { format } from "date-fns";
import Table from "../../components/table/Table";
import { getInvoice } from "../../apis/invoice";
import { IInvoice, IInvoiceDrug } from "../../types/pharmacy";
import InvoiceDetailsComponent from "../../components/invoices/InvoiceDetailsComponent";

const InvoiceDetailsPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryFn: () => getInvoice(id as string),
    queryKey: PURCHASE,
  });

  const openPrintableInvoice = () => {
    const newWindow = window.open("", "_blank") as Window;
    newWindow.document.write(
      "<html><head><title>Printable Invoice</title></head><body>",
    );
    newWindow.document.write('<div id="printableInvoice"></div>');
    newWindow.document.write("</body></html>");
    newWindow.document.close(); // Important: Close the document to prevent infinite loading

    const printableInvoiceDiv =
      newWindow.document.getElementById("printableInvoice");
    ReactDOM.render(
      <InvoiceDetailsComponent invoice={data as IInvoice} />,
      printableInvoiceDiv,
    );
  };

  return (
    <PageContent
      className='w-full bg-white p-4 rounded-md'
      title='Invoice Details'
      isLoading={isLoading}
    >
      {data && (
        <div>
          <div className='flex items-center justify-between'>
            <div>
              {" "}
              <p>Date:{format(new Date(data.createdAt), "dd-MM-yyyy")}</p>
              <p>Served By: {data.user?.name}</p>
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
            <div>
              <DocumentArrowDownIcon
                className='w-8 text-green'
                onClick={() => openPrintableInvoice()}
              />
            </div>
          </div>
          <div className='mt-4'>
            <Table
              position='relative'
              data={data?.drugs || []}
              columns={[
                {
                  title: "Item",
                  key: "item",
                  render: (drug: IInvoiceDrug) => (
                    <span>
                      {drug.drug?.drug_code}({drug.drug?.designation})
                    </span>
                  ),
                },
                {
                  title: "Quantity",
                  key: "item",
                  render: (drug: IInvoiceDrug) => <span>{drug.quantity}</span>,
                },
                {
                  title: "Unit Price",
                  key: "drug",
                  render: (drug: IInvoiceDrug) => <span>{drug.unitPrice}</span>,
                },
                {
                  title: "Total",
                  key: "drug",
                  render: (drug: IInvoiceDrug) => <span>{drug.totalPrice}</span>,
                },
              ]}
            />
          </div>
        </div>
      )}
    </PageContent>
  );
};

export default InvoiceDetailsPage;
