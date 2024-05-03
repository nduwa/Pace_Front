import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState, SetStateAction, Dispatch, FC } from "react";
import Protected from "../../components/auth/Protected";
import Button from "../../components/common/form/Button";
import { IPaged } from "../../types/common";
import { getInstitutionDrugs } from "../../apis/drug";
import { INSTITUTION_DRUGS } from "../../utils/constants/queryKeys";
import PageContent from "../../components/common/PageContent";
import Modal from "../../components/common/Modal";
import Table from "../../components/table/Table";
import { IDrug, IDrugResponse } from "../../types/pharmacy";
import DrugForm from "../../components/drugs/DrugForm";
import DrugTableFilters from "../../components/drugs/DrugTableFilters";

interface IActionComponent {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

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
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<IPaged<IDrugResponse>>();
  const [keyword, setKeyword] = useState<string>();
  const [filters, setFilters] = useState<string>();
  const [filtersLoading, setFiltersLoading] = useState<boolean>(false);
  const { isLoading, data: response } = useQuery({
    queryFn: () => getInstitutionDrugs(""),
    queryKey: INSTITUTION_DRUGS,
  });
  const drugsMutation = useMutation(getInstitutionDrugs);
  const handleSearch = (searchq: string) => {
    setKeyword(searchq);
    drugsMutation.mutate(
      `?searchq=${searchq}&page=1${filters ? `&${filters}` : ``}`,
      {
        onSuccess(result) {
          setData(result);
        },
      },
    );
  };
  const onChangePage = (page: number) => {
    drugsMutation.mutate(
      `?page=${page}${keyword ? `&searchq=${keyword}` : ``}${
        filters ? `&${filters}` : ``
      }`,
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

  const defaultFilters = data?.data
    ? {
        isOnMarket: data.data.isOnMarket,
        drugCategory: data.data.drugCategory,
      }
    : undefined;

  const columns = [
    {
      title: "Drug Dode",
      key: "drug_code",
    },
    {
      title: "Designation",
      key: "designation",
    },
    {
      title: "Category",
      key: "drugCategory",
    },
    { title: "Quantity", key: "totalQuantity" },
    {
      title: "Institution",
      key: "",
      render: (row: IDrug) => (
        <div className='flex'>
          <div>{row.institution ? row.institution.name : "Global"}</div>
        </div>
      ),
    },
  ];
  return (
    <PageContent
      isLoading={isLoading}
      title='Drugs'
      actionsComponent={<ActionsComponent setIsOpen={setIsOpen} />}
    >
      <>
        <Protected permissions={["UPDATE_MEDECINES"]}>
          <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title='Create drug'
          >
            <DrugForm setIsOpen={setIsOpen} />
          </Modal>
        </Protected>

        <Table
          hideFilters={!filtersLoading}
          isLoading={isLoading || drugsMutation.isLoading}
          currentPage={data?.currentPage || 1}
          totalItems={data?.totalItems || 30}
          itemsPerPage={data?.itemsPerPage || 15}
          onChangePage={onChangePage}
          columns={columns}
          data={data?.data.rows || []}
          searchFun={handleSearch}
          filtersComponent={
            <DrugTableFilters
              isLoading={filtersLoading}
              defaultValues={defaultFilters}
              filterFunc={handleFilter}
            />
          }
          usedFilters={filters}
        />
      </>
    </PageContent>
  );
};

export default InstitutionDrugsPage;
