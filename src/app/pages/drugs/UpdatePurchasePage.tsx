import { useQuery } from "@tanstack/react-query";
import { getDrugsNPaged, getPurchase } from "../../apis/drug";
import UpdatePurchaseForm from "../../components/drugs/UpdatePurchaseForm";
import { DRUGS_NPAGED, PURCHASE } from "../../utils/constants/queryKeys";
import { useParams } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import PageContent from "../../components/common/PageContent";

const UpdatePurchasePage = () => {
  const { data: drugs, isLoading } = useQuery({
    queryFn: () => getDrugsNPaged(),
    queryKey: DRUGS_NPAGED,
  });

  const { id } = useParams();
  const { data: purchase, isLoading: purchaseLoading } = useQuery({
    queryFn: () => getPurchase(id as string),
    queryKey: PURCHASE,
  });

  return (
    <>
      <PageContent title='Update Order' isLoading={purchaseLoading || isLoading}>
        {(purchaseLoading || isLoading) && <SyncLoader color='#6DAB3C' />}
        {drugs && purchase !== undefined && (
          <UpdatePurchaseForm drugs={drugs} purchase={purchase} />
        )}
      </PageContent>
    </>
  );
};

export default UpdatePurchasePage;
