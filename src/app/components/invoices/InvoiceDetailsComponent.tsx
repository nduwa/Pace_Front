import { format } from "date-fns";
import Table from "../../components/table/Table";
import { IInvoice, IInvoiceDrug } from "../../types/pharmacy";
import { FC } from "react";

type props = {
  invoice: IInvoice;
};

const InvoiceDetailsComponent: FC<props> = ({ invoice }) => {
  return (
    <div>
      <style>
        {`
        body {
          font-family: Arial;
          font-size: 15px;
        }
        .container {
          width: 100%;
          max-width: 1000px;
          margin: auto;
          display: flex;
          flex-direction: column;
          gap: 30px;

        }
      .flex {
        display: flex;
      
      }
      .items-center {
        align-items: center;
      }
      .justify-between {
        justify-content: space-between;
      }

      table {
        width: 100%;
        border-collapse: collapse
      }
      td, th {
        padding: 10px 15px;
        border: 1px solid black;

      }

      .header {
        
      }
      .patientNo {
        font-size: 25px;
        font-weight: 900;
        font-style: italic;
      }
      .totalCost {
        text-align: right;
      }
      .totalCost div {
        display: inline-block;
        padding: 20px;
        background: #eee;
        font-size: 20px;
        font-weight: 800;
      }
    `}
      </style>

      <div className='container'>
        <div className='header flex justify-between'>
          <div>
            <p>Date:{format(new Date(invoice.createdAt), "dd-MM-yyyy")}</p>
            <p>Served By: {invoice.user?.name}</p>
            <p>Institution: {invoice.institution?.name}</p>
            <p>Branch: {invoice.institution?.parentInstitution?.name || "Main"}</p>
            <p>Invoice NO: {invoice.invoiceNO}</p>
            <p>Name: {invoice.name}</p>
            <p>Phone: {invoice.phone}</p>
          </div>
          {invoice.patient && (
            <div className='text-lg patientNo'>{invoice.patient.patientNO}</div>
          )}
        </div>

        <div className='mt-4'>
          <Table
            position='relative'
            data={invoice?.drugs || []}
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

        <div className='totalCost'>
          <div>{invoice.totalCost} RWF</div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsComponent;
