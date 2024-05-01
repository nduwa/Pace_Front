import { useMutation, useQuery } from "@tanstack/react-query";
import { EyeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Protected from "../../components/auth/Protected";
import Button from "../../components/common/form/Button";
import { getPurchases } from "../../apis/drug";
import { PURCHASES } from "../../utils/constants/queryKeys";
import PageContent from "../../components/common/PageContent";
import Table from "../../components/table/Table";
import { IPurchase } from "../../types/pharmacy";
import { format } from "date-fns";
import TableActions from "../../components/table/TableActions";
import { IPaged } from "../../types/common";
import { useEffect, useState } from "react";

const PurchaseActions = () => {
  return (
    <Protected permissions={["PURCHASE_MEDECINES"]}>
      <Button to='/drugs/orders/add' label='Add' />
    </Protected>
  );
};

const DrugPurchases = () => {
  const [data, setData] = useState<IPaged<IPurchase[]>>();
  const { data: response, isLoading } = useQuery({
    queryFn: () => getPurchases(),
    queryKey: PURCHASES,
  });

  const drugPurchasesMutation = useMutation(getPurchases);

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
    <PageContent
      title='Orders'
      isLoading={isLoading}
      actionsComponent={<PurchaseActions />}
    >
      <Table
        onChangePage={onChangePage}
        currentPage={data?.currentPage || 1}
        totalItems={data?.totalItems || 30}
        itemsPerPage={data?.itemsPerPage || 15}
        columns={[
          {
            title: "Date",
            key: "date",
            render: (purchase: IPurchase) => (
              <p>{format(new Date(purchase.date), "dd-MM-yyyy")}</p>
            ),
          },
          { title: "Items count", key: "drugsCount" },
          {
            title: "Total Cost",
            key: "totalCost",
            render: (purchase: IPurchase) => <p>{purchase.totalCost} Rwf</p>,
          },
          { title: "Supplier", key: "supplier" },
          {
            title: "Actions",
            key: "",
            render: (purchase: IPurchase) => (
              <TableActions>
                <div className='flex flex-col gap-1'>
                  <Link
                    to={`/drugs/orders/${purchase.id}`}
                    className='flex gap-2 hover:bg-gray-50 p-2 cursor-pointer'
                  >
                    <EyeIcon className='w-5 text-green' /> <span>View</span>
                  </Link>
                </div>
              </TableActions>
            ),
          },
        ]}
        data={data?.data ?? []}
      />
    </PageContent>
  );
};

export default DrugPurchases;
