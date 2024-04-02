import { Outlet, useNavigate } from "react-router-dom";
import { useIsAuthenticated, useAuthHeader } from "react-auth-kit";
import { useContext, useEffect } from "react";
import Sidebar from "../navigation/Sidebar";
import TopBar from "../navigation/TopBar";
import { useQuery } from "@tanstack/react-query";
import { USER_PROFILE } from "../../utils/constants/queryKeys";
import { getMyProfile } from "../../apis/profile";
import { Bars } from "react-loading-icons";
import { AuthContext } from "../../context/Auth";

const DashboardLayout = () => {
  const isAuthenticated = useIsAuthenticated();
  const authHeader = useAuthHeader();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: USER_PROFILE,
    queryFn: () => getMyProfile(),
  });
  const authContext = useContext(AuthContext);
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (data) {
      authContext!.setUserProfile(data);
    }
  }, [data, authContext]);

  return (
    <main
      id='app_root_cmp'
      className='flex md:pl-60 min-h-screen'
      accessKey={authHeader()}
    >
      {!isLoading && (
        <>
          <aside>
            <Sidebar />
          </aside>
          <aside className='w-full'>
            <div className='flex flex-col space-y-2'>
              <TopBar />
              <div className='p-4'>
                <Outlet />
              </div>
            </div>
          </aside>
        </>
      )}
      {isLoading && (
        <div className='w-full h-screen bg-darkblue absolute top-0 right-0 z-50 flex items-center justify-center'>
          <Bars />
        </div>
      )}
    </main>
  );
};

export default DashboardLayout;
