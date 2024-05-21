import ReactDOM from "react-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DocumentArrowDownIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Protected from "../../components/auth/Protected";
import Button from "../../components/common/form/Button";
import { INVOICES } from "../../utils/constants/queryKeys";
import PageContent from "../../components/common/PageContent";
import Table from "../../components/table/Table";
import { IInvoice, IInvoiceResponse } from "../../types/pharmacy";
import { format } from "date-fns";
import { IPaged } from "../../types/common";
import { useEffect, useState } from "react";
import { getInvoices } from "../../apis/invoice";
import InvoiceDetailsComponent from "../../components/invoices/InvoiceDetailsComponent";
import InvoiceDrawer from "../../components/invoices/InvoiceDrawer";
import InvoiceDetails from "../../components/invoices/InvoiceDetails";
import InvoiceTableFilters from "../../components/invoices/InvoiceTableFilters";

const InvoiceActions = () => {
  return (
    <Protected permissions={["SERVE_MEDECINES"]}>
      <Button to='/invoices/add' label='Add' />
    </Protected>
  );
};

const DrugInvoices = () => {
  const [data, setData] = useState<IPaged<IInvoiceResponse>>();
  const [filters, setFilters] = useState<string>();
  const [filtersLoading, setFiltersLoading] = useState<boolean>(false);
  const { data: response, isLoading } = useQuery({
    queryFn: () => getInvoices(),
    queryKey: INVOICES,
  });

  const drugInvoicesMutation = useMutation(getInvoices);

  const onChangePage = (page: number) => {
    drugInvoicesMutation.mutate(`?page=${page}${filters ? `&${filters}` : ``}`, {
      onSuccess(result) {
        setData(result);
      },
    });
  };

  const handleFilter = (appliedFilters: string) => {
    setFilters(appliedFilters);
    setFiltersLoading(true);
    drugInvoicesMutation.mutate(`?${appliedFilters}`, {
      onSuccess(result) {
        setFiltersLoading(false);
        setData(result);
      },
      onError() {
        setFiltersLoading(false);
      },
    });
  };

  const defaultFilters = data?.data
    ? {
        requester: data.data.requester,
        startDate: data.data.startDate,
        endDate: data.data.endDate,
      }
    : undefined;

  useEffect(() => {
    if (response) {
      setData(response);
    }
  }, [response]);

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

  return (
    <PageContent
      title='Invoices'
      isLoading={isLoading}
      actionsComponent={<InvoiceActions />}
    >
      <Table
        hideFilters={!filtersLoading}
        onChangePage={onChangePage}
        currentPage={data?.currentPage || 1}
        totalItems={data?.totalItems || 30}
        itemsPerPage={data?.itemsPerPage || 15}
        filtersComponent={
          <InvoiceTableFilters
            isLoading={filtersLoading}
            defaultValues={defaultFilters}
            filterFunc={handleFilter}
          />
        }
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
          {
            title: "Supplier",
            key: "supplier",
            render: (row: IInvoice) => (
              <>
                {row.institution?.name}
                {row.institution?.parentInstitution
                  ? ` (${row.institution?.parentInstitution.name})`
                  : ""}
              </>
            ),
          },
          {
            title: "Actions",
            key: "",
            render: (invoice: IInvoice) => (
              <div className='flex gap-1'>
                <Link
                  to={`/invoices/${invoice.id}`}
                  className='flex gap-2 hover:bg-gray-50 p-2 cursor-pointer'
                >
                  <EyeIcon className='w-5 text-blue' />
                </Link>
                <DocumentArrowDownIcon
                  className='w-5 text-green'
                  onClick={() => openPrintableInvoice(invoice)}
                />
                <InvoiceDrawer>
                  <InvoiceDetails data={invoice} />
                </InvoiceDrawer>
              </div>
            ),
          },
        ]}
        data={data?.data.rows ?? []}
        usedFilters={filters}
      />
    </PageContent>
  );
};

export default DrugInvoices;
