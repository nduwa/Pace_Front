import { useQuery } from "@tanstack/react-query";
import { getDrugsNPaged } from "../../apis/drug";
import { DRUGS_NPAGED } from "../../utils/constants/queryKeys";
import PageContent from "../../components/common/PageContent";
import PurchaseForm from "../../components/drugs/PurchaseForm";

const DrugPurchaseForm = () => {
  const { data, isLoading } = useQuery({
    queryFn: () => getDrugsNPaged(),
    queryKey: DRUGS_NPAGED,
  });

  return (
    <PageContent
      title='Purchase Medecines'
      isLoading={isLoading}
      className='bg-white p-4 rounded-md'
    >
      {data && <PurchaseForm drugs={data} />}
    </PageContent>
  );
};

export default DrugPurchaseForm;
