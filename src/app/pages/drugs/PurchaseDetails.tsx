import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import PageContent from "../../components/common/PageContent";
import { getPurchase } from "../../apis/drug";
import { PURCHASE } from "../../utils/constants/queryKeys";
import { format } from "date-fns";
import Table from "../../components/table/Table";
import { IDrugPurchase } from "../../types/pharmacy";

const PurchaseDetailsPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryFn: () => getPurchase(id as string),
    queryKey: PURCHASE,
  });
  return (
    <PageContent
      className='w-full bg-white p-4 rounded-md'
      title='Order Details'
      isLoading={isLoading}
    >
      {data && (
        <div>
          <div className='flex items-center justify-between'>
            <div>
              {" "}
              <p className='font-md text-lg text-gray-900'>#:{data.purchaseNO}</p>
              <p>Date:{format(new Date(data.date || ""), "dd-MM-yyyy")}</p>
              <p>Supllier:{data.supplier}</p>
            </div>
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
          </div>
        </div>
      )}
    </PageContent>
  );
};

export default PurchaseDetailsPage;
