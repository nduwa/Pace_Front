import { useMutation, useQuery } from "@tanstack/react-query";
import { PATIENT_INVOICES } from "../../utils/constants/queryKeys";
import Table from "../../components/table/Table";
import { IInvoice, IPatient, IPatientInvoiceResponse } from "../../types/pharmacy";
import { format } from "date-fns";
import { IPaged } from "../../types/common";
import { FC, useEffect, useState } from "react";
import InvoiceDrawer from "../../components/invoices/InvoiceDrawer";
import InvoiceDetails from "../../components/invoices/InvoiceDetails";
import { getPatientInvoices } from "../../apis/patients";
import PatientInvoiceTableFilters from "../../components/patients/PatientInvoiceTableFilters";

interface props {
  patient: IPatient;
}
const PatientInvoicesModal: FC<props> = ({ patient }) => {
  const [data, setData] = useState<IPaged<IPatientInvoiceResponse>>();
  const [filters, setFilters] = useState<string>();
  const [filtersLoading, setFiltersLoading] = useState<boolean>(false);
  const { data: response, isLoading } = useQuery({
    queryFn: () => getPatientInvoices({ id: patient.id }),
    queryKey: PATIENT_INVOICES,
  });

  const drugInvoicesMutation = useMutation(getPatientInvoices);

  const onChangePage = (page: number) => {
    drugInvoicesMutation.mutate(
      {
        id: patient.id,
        params: `?patientId=${patient.id}&page=${page}${
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
        id: patient.id,
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

  return (
    <>
      <div className='bg-white p-6'>
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
        position='relative'
        hideFilters={!filtersLoading}
        isLoading={isLoading}
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
          {
            title: "Items",
            key: "drugsCount",
            render: (row: IInvoice) => (
              <>
                {row.drugs?.map((drug) => (
                  <div className='flex justify-between'>
                    <div>{drug.drug?.designation}</div>
                    <div>{drug.quantity}</div>
                  </div>
                ))}{" "}
              </>
            ),
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
    </>
  );
};

export default PatientInvoicesModal;
