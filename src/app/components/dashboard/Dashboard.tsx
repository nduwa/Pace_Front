import { useContext } from "react";
import { AuthContext } from "../../context/Auth";

const Dashboard = () => {
  const user = useContext(AuthContext)?.userProfile;
  return <p>This is the Dashboard. Welcome {user?.name}!</p>;
};

export default Dashboard;
