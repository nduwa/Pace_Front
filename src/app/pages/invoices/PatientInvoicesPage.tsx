import ReactDOM from "react-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DocumentArrowDownIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PATIENT_INVOICES } from "../../utils/constants/queryKeys";
import PageContent from "../../components/common/PageContent";
import Table from "../../components/table/Table";
import { IInvoice, IPatientInvoiceResponse } from "../../types/pharmacy";
import { format } from "date-fns";
import { IPaged } from "../../types/common";
import { useEffect, useState } from "react";
import InvoiceDetailsComponent from "../../components/invoices/InvoiceDetailsComponent";
import InvoiceDrawer from "../../components/invoices/InvoiceDrawer";
import InvoiceDetails from "../../components/invoices/InvoiceDetails";
import { getPatient, getPatientInvoices } from "../../apis/patients";
import PatientInvoiceTableFilters from "../../components/patients/PatientInvoiceTableFilters";

const PatientInvoicesPage = () => {
  const patientId = useParams().id as string;

  const navigate = useNavigate();
  if (!patientId) {
    navigate("/patients");
    return <></>;
  }

  const [data, setData] = useState<IPaged<IPatientInvoiceResponse>>();
  const [filters, setFilters] = useState<string>();
  const [filtersLoading, setFiltersLoading] = useState<boolean>(false);
  const { data: response, isLoading } = useQuery({
    queryFn: () => getPatientInvoices({ id: patientId }),
    queryKey: PATIENT_INVOICES,
  });

  const { data: patient, isLoading: patientLoading } = useQuery({
    queryFn: () => getPatient(patientId),
    queryKey: ["patient"],
  });

  const drugInvoicesMutation = useMutation(getPatientInvoices);

  const onChangePage = (page: number) => {
    drugInvoicesMutation.mutate(
      {
        id: patientId,
        params: `?patientId=${patientId}&page=${page}${
          filters ? `&${filters}` : ``
        }`,
      },
      {
        onSuccess(result) {
          setData(result);
        },
      },
    );
  };

  const handleFilter = (appliedFilters: string) => {
    setFilters(appliedFilters);
    setFiltersLoading(true);
    drugInvoicesMutation.mutate(
      {
        id: patientId,
        params: `?${appliedFilters}`,
      },
      {
        onSuccess(result) {
          setFiltersLoading(false);
          setData(result);
        },
        onError() {
          setFiltersLoading(false);
        },
      },
    );
  };

  const defaultFilters = data?.data
    ? {
        type: data.data.type,
        startDate: data.data.startDate,
        endDate: data.data.endDate,
        institution: data.data.institution,
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
    <PageContent title={`Patient Invoices`} isLoading={isLoading || patientLoading}>
      <div className='bg-white p-6'>
        <h1 className='font-bold text-md'>
          {patient?.patientNO} {patient?.name}
        </h1>
        <div className='flex'>
          <div className='w-24 opacity-70'>NID</div>
          <div>{patient?.NID}</div>
        </div>
        <div className='flex'>
          <div className='w-24 opacity-70'>Phone</div>
          <div>{patient?.phone}</div>
        </div>
      </div>
      <Table
        hideFilters={!filtersLoading}
        onChangePage={onChangePage}
        currentPage={data?.currentPage || 1}
        totalItems={data?.totalItems || 30}
        itemsPerPage={data?.itemsPerPage || 15}
        filtersComponent={
          <PatientInvoiceTableFilters
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

export default PatientInvoicesPage;
