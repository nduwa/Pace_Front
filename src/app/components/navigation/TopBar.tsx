import { Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import ToggleSidebar from "../../helpers/ToggleSidebar";
import TopUserProfile from "../profile/TopUserProfile";

const TopBar = () => {
  return (
    <>
      <div className='w-full flex  justify-between border-b bg-white px-6 py-4 items-center'>
        <div className=' flex items-center'>
          <button type='button' onClick={() => ToggleSidebar()}>
            <Bars3BottomLeftIcon className='w-7 text-darkblue md:hidden' />{" "}
          </button>
        </div>

        <div className='flex space-x-3 justify-between items-center'>
          <TopUserProfile />
        </div>
      </div>
    </>
  );
};

export default TopBar;
