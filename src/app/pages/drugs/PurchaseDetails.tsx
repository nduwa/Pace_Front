import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageContent from "../../components/common/PageContent";
import { approvePurchase, deletePurchase, getPurchase } from "../../apis/drug";
import { PURCHASE, PURCHASES } from "../../utils/constants/queryKeys";
import { format } from "date-fns";
import Table from "../../components/table/Table";
import { IDrugPurchase } from "../../types/pharmacy";
import Button from "../../components/common/form/Button";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Protected from "../../components/auth/Protected";
import ConfirmDelete from "../../components/common/ConfirmDelete";
import { useState } from "react";

const PurchaseDetailsPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryFn: () => getPurchase(id as string),
    queryKey: PURCHASE,
  });
  const navigate = useNavigate();

  const [toDelete, setToDelete] = useState<string | undefined>();
  const approveMutation = useMutation(approvePurchase);

  const approve = () => {
    approveMutation.mutate(id as string, {
      onSettled: () => {
        navigate("/drugs/orders");
      },

      onSuccess: () => {
        navigate("/drugs/orders");
      },
    });
  };

  return (
    <PageContent
      className='w-full bg-white p-4 rounded-md'
      title='Order Details'
      isLoading={isLoading}
    >
      {data && (
        <div>
          <div>
            <div className='flex gap-4 flex-col'>
              <div>
                {" "}
                <p className='font-md text-lg text-gray-900'>#:{data.purchaseNO}</p>
                <p>Date:{format(new Date(data.date || ""), "dd-MM-yyyy")}</p>
                <p>Supllier:{data.supplier}</p>
                <p>Items count:{data.drugsCount}</p>
                <p>Total Cost:{data.totalCost}</p>
              </div>

              {!data.approved && (
                <div className='flex space-x-2'>
                  <Link
                    to={`/drugs/orders/${data.id}/update`}
                    className='flex gap-2 hover:bg-gray-50 p-2 cursor-pointer'
                  >
                    <PencilIcon className='w-5 text-green' /> <span>Edit</span>
                  </Link>
                  <Protected permissions={["UPDATE_INSTITUTIONS"]}>
                    {toDelete && (
                      <ConfirmDelete
                        type='purchase'
                        id={toDelete}
                        fn={async (id: string) => {
                          await deletePurchase(id);
                          return 1;
                        }}
                        queryKey={PURCHASES}
                        setToDelete={setToDelete}
                      />
                    )}
                    <div
                      className='flex gap-2 py-1 px-2 items-center hover:bg-gray-100 cursor-pointer'
                      onClick={() => setToDelete(id)}
                    >
                      <TrashIcon className='w-4 text-red' /> Delete
                    </div>
                  </Protected>

                  <Button
                    onClick={() => approve()}
                    isLoading={approveMutation.isLoading}
                    label='Approve'
                    className='py-1'
                  />
                </div>
              )}
            </div>
            <div className='mt-4'>
              <Table
                position='relative'
                data={data.drugs}
                columns={[
                  {
                    title: "Item",
                    key: "item",
                    render: (drug: IDrugPurchase) => (
                      <span>
                        {drug.drug?.drug_code}({drug.drug?.designation})
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
                    key: "",
                    render: (drug: IDrugPurchase) => <span>{drug.unitPrice}</span>,
                  },
                  {
                    title: "Total",
                    key: "",
                    render: (drug: IDrugPurchase) => <span>{drug.totalPrice}</span>,
                  },
                  {
                    title: "Selling Price",
                    key: "",
                    render: (drug: IDrugPurchase) => (
                      <span>{drug.sellingPrice}</span>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      )}
    </PageContent>
  );
};

export default PurchaseDetailsPage;
