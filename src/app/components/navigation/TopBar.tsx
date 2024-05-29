import { Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import ToggleSidebar from "../../helpers/ToggleSidebar";
import TopUserProfile from "../profile/TopUserProfile";
import { AuthContext } from "../../context/Auth";
import { useContext } from "react";

const TopBar = () => {
  const user = useContext(AuthContext)?.userProfile;
  return (
    <>
      <div className='w-full flex  justify-between border-b bg-white px-6 py-4 items-center'>
        <div className=' flex items-center'>
          <button type='button' onClick={() => ToggleSidebar()}>
            <Bars3BottomLeftIcon className='w-7 text-darkblue md:hidden' />{" "}
          </button>
          <div className='ml-4 flex flex-col'>
            <div className='font-bold text-md'>
              {user?.institution ? user.institution.name : "ADMIN"}
            </div>
            {user?.institution?.parentInstitution && (
              <div className='font-light text-xs'>
                {user.institution.parentInstitution.name}
              </div>
            )}
          </div>
        </div>

        <div className='flex space-x-3 justify-between items-center'>
          <TopUserProfile />
        </div>
      </div>
    </>
  );
};

export default TopBar;
