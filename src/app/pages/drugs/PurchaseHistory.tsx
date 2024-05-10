import { useMutation, useQuery } from "@tanstack/react-query";
import { getDrugsPurchaseHistory } from "../../apis/drug";
import { DRUG_PURCHASES } from "../../utils/constants/queryKeys";
import PageContent from "../../components/common/PageContent";
import Table from "../../components/table/Table";
import { IDrugPurchase, IDrugPurchaseResponse } from "../../types/pharmacy";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { IPaged } from "../../types/common";

const PurchaseHistory = () => {
  const [data, setData] = useState<IPaged<IDrugPurchaseResponse>>();
  const { isLoading, data: response } = useQuery({
    queryFn: () => getDrugsPurchaseHistory(""),
    queryKey: DRUG_PURCHASES,
  });
  const drugPurchasesMutation = useMutation(getDrugsPurchaseHistory);

  const onChangePage = (page: number) => {
    drugPurchasesMutation.mutate(
      `?page=${page}}
      }`,
      {
        onSuccess(result) {
          setData(result);
        },
      },
    );
  };

  useEffect(() => {
    if (response) {
      setData(response);
    }
  }, [response]);

  return (
    <PageContent title='Purchase History' isLoading={isLoading}>
      {data && (
        <Table
          data={data?.data.rows || []}
          onChangePage={onChangePage}
          currentPage={data?.currentPage || 1}
          totalItems={data?.totalItems || 30}
          itemsPerPage={data?.itemsPerPage || 15}
          columns={[
            {
              title: "PurchaseNO",
              key: "date",
              render: (drug: IDrugPurchase) => (
                <span>{drug.purchase?.purchaseNO}</span>
              ),
            },
            {
              title: "Date",
              key: "date",
              render: (drug: IDrugPurchase) => (
                <span>{format(new Date(drug.createdAt), "yyyy-MM-dd")}</span>
              ),
            },
            {
              title: "Item",
              key: "item",
              render: (drug: IDrugPurchase) => (
                <span>
                  {drug?.drug?.drug_code}({drug.drug?.designation})
                </span>
              ),
            },
            {
              title: "Quantity",
              key: "item",
              render: (drug: IDrugPurchase) => <span>{drug.quantity}</span>,
            },
            {
              title: "Unit Price",
              key: "drug",
              render: (drug: IDrugPurchase) => <span>{drug.unitPrice}</span>,
            },
            {
              title: "Total",
              key: "drug",
              render: (drug: IDrugPurchase) => <span>{drug.totalPrice}</span>,
            },
            {
              title: "Selling Price",
              key: "drug",
              render: (drug: IDrugPurchase) => <span>{drug.sellingPrice}</span>,
            },
          ]}
        />
      )}
    </PageContent>
  );
};

export default PurchaseHistory;
