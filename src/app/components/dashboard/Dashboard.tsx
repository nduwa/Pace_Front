import { FC, useContext } from "react";
import { IDashboard, IDashboardTransactions } from "../../types";
import Statistics from "./Statistics";
import TransactionsStatistics from "./components/Transactions";
import Protected from "../auth/Protected";
import { AuthContext } from "../../context/Auth";

type props = {
  data: IDashboard;
  statistics: IDashboardTransactions;
};

const Dashboard: FC<props> = ({ data, statistics }) => {
  const user = useContext(AuthContext)?.userProfile;
  return (
    <div>
      {user && <Statistics data={data} user={user} />}
      <Protected permissions={["VIEW_TRANSACTIONS"]}>
        <TransactionsStatistics transactions={statistics} />
      </Protected>
    </div>
  );
};

export default Dashboard;
