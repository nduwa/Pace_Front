import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState, FC } from "react";
import Protected from "../../components/auth/Protected";
import Button from "../../components/common/form/Button";
import { IPaged } from "../../types/common";
import { getInstitutionDrugs } from "../../apis/drug";
import { INSTITUTION_DRUGS } from "../../utils/constants/queryKeys";
import PageContent from "../../components/common/PageContent";
import Table from "../../components/table/Table";
import { IInstitutionDrug, IInstitutionDrugResponse } from "../../types/pharmacy";
import DrugTableFilters from "../../components/drugs/DrugTableFilters";
import { format } from "date-fns";

interface IActionComponent {}

const ActionsComponent: FC<IActionComponent> = () => {
  return (
    <>
      <Protected permissions={["PURCHASE_MEDECINES"]}>
        <Button to='/drugs/orders/add' label='Add' />
      </Protected>
    </>
  );
};

const InstitutionDrugsPage = () => {
  const [data, setData] = useState<IPaged<IInstitutionDrugResponse>>();
  const [filters, setFilters] = useState<string>();
  const [filtersLoading, setFiltersLoading] = useState<boolean>(false);
  const { isLoading, data: response } = useQuery({
    queryFn: () => getInstitutionDrugs(""),
    queryKey: INSTITUTION_DRUGS,
  });
  const drugsMutation = useMutation(getInstitutionDrugs);
  const onChangePage = (page: number) => {
    drugsMutation.mutate(`?page=${page}${filters ? `&${filters}` : ``}`, {
      onSuccess(result) {
        setData(result);
      },
    });
  };
  const handleFilter = (appliedFilters: string) => {
    setFilters(appliedFilters);
    setFiltersLoading(true);
    drugsMutation.mutate(`?${appliedFilters}`, {
      onSuccess(result) {
        setFiltersLoading(false);
        setData(result);
      },
      onError() {
        setFiltersLoading(false);
      },
    });
  };
  useEffect(() => {
    if (response) {
      setData(response);
    }
  }, [response]);

  const columns = [
    {
      title: "Drug Dode",
      key: "drug_code",
      render: (row: IInstitutionDrug) => (
        <div className='flex'>
          <div>{row.drug?.drug_code}</div>
        </div>
      ),
    },
    {
      title: "Designation",
      key: "designation",
      render: (row: IInstitutionDrug) => (
        <div className='flex'>
          <div>{row.drug?.designation}</div>
        </div>
      ),
    },
    {
      title: "Category",
      key: "drugCategory",
      render: (row: IInstitutionDrug) => (
        <div className='flex'>
          <div>{row.drug?.drugCategory}</div>
        </div>
      ),
    },
    {
      title: "Batch Number",
      key: "drugCategory",
      render: (row: IInstitutionDrug) => (
        <div className='flex'>
          <div>{row.batchNumber}</div>
        </div>
      ),
    },
    {
      title: "Expire Date",
      key: "drugCategory",
      render: (row: IInstitutionDrug) => (
        <div className='flex'>
          <div>{format(new Date(row.expireDate || ""), "yyyy-MM-dd")}</div>
        </div>
      ),
    },
    { title: "Quantity", key: "quantity" },
  ];
  return (
    <PageContent
      isLoading={isLoading}
      title='Drugs in stock'
      actionsComponent={<ActionsComponent />}
    >
      <>
        <Table
          hideFilters={!filtersLoading}
          isLoading={isLoading || drugsMutation.isLoading}
          currentPage={data?.currentPage || 1}
          totalItems={data?.totalItems || 30}
          itemsPerPage={data?.itemsPerPage || 15}
          onChangePage={onChangePage}
          columns={columns}
          data={data?.data.rows || []}
          filtersComponent={
            <DrugTableFilters isLoading={filtersLoading} filterFunc={handleFilter} />
          }
          usedFilters={filters}
        />
      </>
    </PageContent>
  );
};

export default InstitutionDrugsPage;
