import { useQuery } from "@tanstack/react-query";
import { TrashIcon, EyeIcon, PencilIcon } from "@heroicons/react/24/outline";
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

const PurchaseActions = () => {
  return (
    <Protected permissions={["PURCHASE_MEDECINES"]}>
      <Button to='/drugs/purchases/add' label='Puchase' />
    </Protected>
  );
};

const DrugPurchases = () => {
  const { data, isLoading } = useQuery({
    queryFn: () => getPurchases(),
    queryKey: PURCHASES,
  });
  return (
    <PageContent
      title='Purchases'
      isLoading={isLoading}
      actionsComponent={<PurchaseActions />}
    >
      <Table
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
                  <div className='flex gap-2 hover:bg-gray-50 p-2 cursor-pointer'>
                    <PencilIcon className='w-5 text-blue-500' /> <span>Edit</span>
                  </div>
                  <Link
                    to={`/drugs/purchases/${purchase.id}`}
                    className='flex gap-2 hover:bg-gray-50 p-2 cursor-pointer'
                  >
                    <EyeIcon className='w-5 text-green' /> <span>View</span>
                  </Link>
                  <div className='flex gap-2 hover:bg-gray-50 p-2 cursor-pointer'>
                    <TrashIcon className='w-5 text-red-500' />
                    <span>Delete</span>
                  </div>
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
