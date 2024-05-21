import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { IPaged } from "../../types/common";
import { getInstitutionDrugs } from "../../apis/drug";
import { INSTITUTION_DRUGS_GROUPED } from "../../utils/constants/queryKeys";
import Table from "../../components/table/Table";
import { IInstitutionDrug, IInstitutionDrugResponse } from "../../types/pharmacy";
import SearchComponent from "../../components/drugs/InstitutionDrugSearch";
import TableActions from "../../components/table/TableActions";
import InstitutionDrugTableActions from "../../components/drugs/InstitutionDrugTableActions";

const InstitutionDrugsGrouped = () => {
  const [data, setData] = useState<IPaged<IInstitutionDrugResponse>>();
  const [drugSelect, setDrugSelect] = useState<string>();
  const params = "?listType=grouped&";
  const { isLoading, data: response } = useQuery({
    queryFn: () => getInstitutionDrugs(params),
    queryKey: INSTITUTION_DRUGS_GROUPED,
  });
  const drugsMutation = useMutation(getInstitutionDrugs);
  const onChangePage = (page: number) => {
    drugsMutation.mutate(`${params}page=${page}&drug=${drugSelect}}`, {
      onSuccess(result) {
        setData(result);
      },
    });
  };

  const handleSearch = (searchq: string) => {
    setDrugSelect(searchq);
    drugsMutation.mutate(`${params}drug=${searchq}&page=1`, {
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
    { title: "Quantity", key: "totalQuantity" },
    { title: "Price", key: "price" },
    {
      title: "Actions",
      key: "actions",
      render: (row: IInstitutionDrug) => {
        return (
          <TableActions>
            <InstitutionDrugTableActions drug={row} />
          </TableActions>
        );
      },
    },
  ];
  return (
    <div className='mt-6'>
      <>
        <Table
          isLoading={isLoading || drugsMutation.isLoading}
          currentPage={data?.currentPage || 1}
          totalItems={data?.totalItems || 30}
          itemsPerPage={data?.itemsPerPage || 15}
          onChangePage={onChangePage}
          columns={columns}
          data={data?.data.rows || []}
          searchComponent={<SearchComponent searchFun={handleSearch} />}
        />
      </>
    </div>
  );
};

export default InstitutionDrugsGrouped;
