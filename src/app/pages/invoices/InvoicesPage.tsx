import { useMutation, useQuery } from "@tanstack/react-query";
import { EyeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Protected from "../../components/auth/Protected";
import Button from "../../components/common/form/Button";
import { PURCHASES } from "../../utils/constants/queryKeys";
import PageContent from "../../components/common/PageContent";
import Table from "../../components/table/Table";
import { IInvoice, IInvoiceResponse } from "../../types/pharmacy";
import { format } from "date-fns";
import TableActions from "../../components/table/TableActions";
import { IPaged } from "../../types/common";
import { useEffect, useState } from "react";
import { getInvoices } from "../../apis/invoice";

const InvoiceActions = () => {
  return (
    <Protected permissions={["SERVE_MEDECINES"]}>
      <Button to='/invoices/add' label='Add' />
    </Protected>
  );
};

const DrugInvoices = () => {
  const [data, setData] = useState<IPaged<IInvoiceResponse>>();
  const { data: response, isLoading } = useQuery({
    queryFn: () => getInvoices(),
    queryKey: PURCHASES,
  });

  const drugInvoicesMutation = useMutation(getInvoices);

  const onChangePage = (page: number) => {
    drugInvoicesMutation.mutate(`?page=${page}`, {
      onSuccess(result) {
        setData(result);
      },
    });
  };

  useEffect(() => {
    if (response) {
      setData(response);
    }
  }, [response]);

  return (
    <PageContent
      title='Invoices'
      isLoading={isLoading}
      actionsComponent={<InvoiceActions />}
    >
      <Table
        onChangePage={onChangePage}
        currentPage={data?.currentPage || 1}
        totalItems={data?.totalItems || 30}
        itemsPerPage={data?.itemsPerPage || 15}
        columns={[
          { title: "InvoiceNO", key: "invoiceNO" },
          {
            title: "Date",
            key: "date",
            render: (invoice: IInvoice) => (
              <p>{format(new Date(invoice.createdAt), "dd-MM-yyyy")}</p>
            ),
          },
          { title: "Items count", key: "drugsCount" },
          {
            title: "Total Cost",
            key: "totalCost",
            render: (invoice: IInvoice) => <p>{invoice.totalCost} Rwf</p>,
          },
          { title: "Supplier", key: "supplier" },
          {
            title: "Actions",
            key: "",
            render: (invoice: IInvoice) => (
              <TableActions>
                <div className='flex flex-col gap-1'>
                  <Link
                    to={`/invoices/${invoice.id}`}
                    className='flex gap-2 hover:bg-gray-50 p-2 cursor-pointer'
                  >
                    <EyeIcon className='w-5 text-green' /> <span>View</span>
                  </Link>
                </div>
              </TableActions>
            ),
          },
        ]}
        data={data?.data.rows ?? []}
      />
    </PageContent>
  );
};

export default DrugInvoices;
