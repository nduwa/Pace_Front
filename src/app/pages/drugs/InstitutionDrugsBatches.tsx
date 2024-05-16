import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { IPaged } from "../../types/common";
import { getInstitutionDrugs } from "../../apis/drug";
import { INSTITUTION_DRUGS } from "../../utils/constants/queryKeys";
import Table from "../../components/table/Table";
import { IInstitutionDrug, IInstitutionDrugResponse } from "../../types/pharmacy";
import { differenceInDays, format } from "date-fns";
import SearchComponent from "../../components/drugs/InstitutionDrugSearch";

const InstitutionDrugsBatches = () => {
  const [data, setData] = useState<IPaged<IInstitutionDrugResponse>>();
  const [drugSelect, setDrugSelect] = useState<string>();
  const params = "?listType=batchNumbers&";
  const { isLoading, data: response } = useQuery({
    queryFn: () => getInstitutionDrugs(params),
    queryKey: INSTITUTION_DRUGS,
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

  const today = new Date();

  const calculateDiff = (date: string | Date) => {
    const futureDate = new Date(date);
    const diff = differenceInDays(futureDate, today);
    if (diff < 90) {
      return <span style={{ color: "orange" }}>{diff} days</span>;
    } else if (diff < 0) {
      return <span style={{ color: "red" }}>Expired ({diff})</span>;
    }

    return <span>{diff} days</span>;
  };

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
    {
      title: "Left days",
      key: "",
      render: (row: IInstitutionDrug) => (
        <div className='flex'>{calculateDiff(row.expireDate || "")}</div>
      ),
    },
    { title: "Quantity", key: "quantity" },
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

export default InstitutionDrugsBatches;
