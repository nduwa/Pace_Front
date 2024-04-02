import { NavLink } from "react-router-dom";
import { SidebarLinkProps } from "../../types/index";

const Sidebar = ({ text, to, Icon }: SidebarLinkProps) => {
  return (
    <div className='flex justify-center mt-2 relative group'>
      <NavLink
        to={to}
        className={(navData) =>
          `w-full flex p-2 ${
            navData.isActive ? "text-white bg-gray-500 bg-opacity-50" : "text-white"
          } hover:white rounded-md space-5 items-center capitalize`
        }
      >
        {Icon}
        <div className='text-md font-base ml-4'>{text}</div>
      </NavLink>
    </div>
  );
};

export default Sidebar;
