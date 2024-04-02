import { UsersIcon, XCircleIcon } from "@heroicons/react/24/outline";
import SidebarLink from "./SidebarLink";
import ToggleSidebar from "../../helpers/ToggleSidebar";
import logo from "../../assets/logo-color.png";
import { HasPermissionGroup } from "../../helpers/HasPermissionGroup";

const Sidebar = () => {
  return (
    <div className='min-h-screen'>
      <div className='sidebar w-60 flex overflow-x-clip flex-col h-full justify-between border shadow duration-300 z-10 sidebar fixed top-0 bottom-0 left-[-300px] md:left-0 bg-darkblue'>
        <div className='flex min-h-screen flex-col justify-between items-center pt-2 pb-6 w-full h-full'>
          <div className='px-4 flex items-center justify-between mb-8 md:justify-center w-full'>
            <img src={logo} alt='DigitalMed Logo' className='w-12 h-auto' />
            <button onClick={() => ToggleSidebar()} className='md:hidden'>
              <XCircleIcon className='w-6 text-white' />
            </button>
          </div>
          <div className='py-2 h-full overflow-y-auto w-full px-4'>
            {HasPermissionGroup("Users") && (
              <SidebarLink
                text='Users'
                to='/users'
                Icon={<UsersIcon className='w-5 stroke-2 text-white' />}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
