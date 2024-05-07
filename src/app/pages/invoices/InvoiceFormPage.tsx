import { useQuery } from "@tanstack/react-query";
import { getInstitutionDrugsNPaged } from "../../apis/drug";
import { INSTITUTION_DRUGS_NPAGED } from "../../utils/constants/queryKeys";
import PageContent from "../../components/common/PageContent";
import InvoiceForm from "../../components/invoices/InvoiceForm";

const InvoiceFormPage = () => {
  const { data, isLoading } = useQuery({
    queryFn: () => getInstitutionDrugsNPaged(),
    queryKey: INSTITUTION_DRUGS_NPAGED,
  });

  return (
    <PageContent
      title='Serve Medecines'
      isLoading={isLoading}
      className='bg-white p-4 rounded-md'
    >
      {data && <InvoiceForm drugs={data} />}
    </PageContent>
  );
};

export default InvoiceFormPage;
