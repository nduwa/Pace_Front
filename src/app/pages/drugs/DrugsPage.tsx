import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState, SetStateAction, Dispatch, FC } from "react";
import Protected from "../../components/auth/Protected";
import Button from "../../components/common/form/Button";
import { IPaged } from "../../types/common";
import { getDrugs } from "../../apis/drug";
import { DRUGS } from "../../utils/constants/queryKeys";
import PageContent from "../../components/common/PageContent";
import Modal from "../../components/common/Modal";
import Table from "../../components/table/Table";
import TableActions from "../../components/table/TableActions";
import { IDrug, IDrugResponse } from "../../types/pharmacy";
import DrugForm from "../../components/drugs/DrugForm";
import DrugTableActions from "../../components/drugs/DrugTableActions";
import DrugTableFilters from "../../components/drugs/DrugTableFilters";
import ImportDrugs from "../../components/drugs/ImportDrugs";

interface IActionComponent {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const ActionsComponent: FC<IActionComponent> = ({ setIsOpen }) => {
  const openCreateDrugModal = () => {
    setIsOpen(true);
  };
  return (
    <>
      <Protected permissions={["IMPORT_MEDECINES"]}>
        <ImportDrugs />
      </Protected>
      <Protected permissions={["UPDATE_MEDECINES"]}>
        <Button onClick={openCreateDrugModal} label='Add drug' />
      </Protected>
    </>
  );
};

const DrugsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<IPaged<IDrugResponse>>();
  const [keyword, setKeyword] = useState<string>();
  const [filters, setFilters] = useState<string>();
  const [filtersLoading, setFiltersLoading] = useState<boolean>(false);
  const { isLoading, data: response } = useQuery({
    queryFn: () => getDrugs(""),
    queryKey: DRUGS,
  });
  const drugsMutation = useMutation(getDrugs);
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

    {
      title: "Institution",
      key: "",
      render: (row: IDrug) => (
        <div className='flex'>
          <div>{row.institution ? row.institution.name : "Global"}</div>
        </div>
      ),
    },

    {
      title: "Actions",
      key: "actions",
      render: (row: IDrug) => {
        return (
          <TableActions>
            <DrugTableActions drug={row} />
          </TableActions>
        );
      },
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

export default DrugsPage;
