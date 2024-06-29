import { FC, ReactNode } from "react";
import { HasPermissionGroup } from "../../../helpers/HasPermissionGroup";
import { PermissionGroup } from "../../../constants/permissions";
import { Link } from "react-router-dom";

type props = {
  label: string;
  number: number;
  permission: PermissionGroup;
  link: string;
  icon: ReactNode;
};

const Statistic: FC<props> = ({ label, number, permission, link, icon }) => {
  return (
    <>
      <div className='w-full'>
        <div className='bg-white rounded-lg shadow flex flex-col justify-start'>
          <div className='px-3 py-5 justify-start items-center gap-3 inline-flex'>
            <div className='p-2 bg-blue-950 rounded-md justify-center items-center flex'>
              <div className='w-7 h-7 relative'>{icon}</div>
            </div>
            <div className='flex flex-col justify-start items-start'>
              <div className='text-gray-500 text-sm'>{label}</div>
              <div className='inline-flex'>
                <div className='text-gray-900 text-lg font-bold'>{number}</div>
              </div>
            </div>
          </div>
          {HasPermissionGroup(permission) && (
            <Link
              to={link}
              className='h-[52px] p-4 bg-gray-50 flex-col justify-center items-start flex rounded-bl-lg roundend-br-lg'
            >
              <div className='justify-start items-center inline-flex'>
                <div className='text-lime-600 text-base font-medium leading-tight'>
                  View all
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Statistic;
