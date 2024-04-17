import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import PageContent from "../../components/common/PageContent";
import { getPurchase } from "../../apis/drug";
import { PURCHASE } from "../../utils/constants/queryKeys";
import { format } from "date-fns";
import Table from "../../components/table/Table";
import { IDrugPurchase } from "../../types/pharmacy";
import PurchaseDrawer from "./PurchaseDrawer";
import PurchaseAdjustement from "../../components/drugs/PurchaseAdjustement";

const PurchaseDetailsPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryFn: () => getPurchase(id as string),
    queryKey: PURCHASE,
  });
  return (
    <PageContent
      className='w-full bg-white p-4 rounded-md'
      title='Adjustment Details'
      isLoading={isLoading}
    >
      {data && (
        <div>
          <div className='flex items-center justify-between'>
            <div>
              {" "}
              <p>Date:{format(new Date(data.date), "dd-MM-yyyy")}</p>
              <p>Supllier:{data.supplier}</p>
            </div>
            <div>
              <DocumentArrowDownIcon className='w-8 text-green' />
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
                {
                  title: "",
                  key: "",
                  render: (drug: IDrugPurchase) => (
                    <PurchaseDrawer>
                      <PurchaseAdjustement data={drug} />
                    </PurchaseDrawer>
                  ),
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
