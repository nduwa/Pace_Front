// import Protected from "../../components/auth/Protected";
import { useQuery } from "@tanstack/react-query";
import PageContent from "../../components/common/PageContent";
import Dashboard from "../../components/dashboard/Dashboard";
import { dashboard, transactionsDashboard } from "../../apis/dashboard";
import { SyncLoader } from "react-spinners";

const Secure = () => {
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => dashboard(),
  });

  const { data: statistics } = useQuery({
    queryKey: ["transaction"],
    queryFn: () => transactionsDashboard(``),
  });

  return (
    <PageContent title='Dashboard'>
      {(!data || !statistics) && <SyncLoader color='#6DAB3C' />}

      {data && statistics && <Dashboard data={data} statistics={statistics} />}
    </PageContent>
  );
};

export default Secure;
