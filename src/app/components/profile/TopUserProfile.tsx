import { Fragment, useContext } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  ArrowRightOnRectangleIcon,
  BellIcon,
  Cog6ToothIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useSignOut } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import ProfileAvatar from "./ProfileAvatar";
import { AuthContext } from "../../context/Auth";

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function DashTop() {
  const singout = useSignOut();
  const navigate = useNavigate();
  const logout = () => {
    singout();
    navigate("/login");
  };
  const user = useContext(AuthContext)?.userProfile;

  return (
    <>
      <div>
        <div className='ml-4 flex items-center md:ml-6'>
          <button
            type='button'
            className='rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2'
          >
            <span className='sr-only'>View notifications</span>
            <BellIcon className='h-6 w-6' aria-hidden='true' />
          </button>

          <Menu as='div' className='relative ml-3'>
            <div>
              <Menu.Button className='flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 lg:rounded-md lg:p-2 lg:hover:bg-gray-50'>
                <div className='w-10'>
                  <ProfileAvatar color='#0369a1' name='User' size='w-24 h-24' />{" "}
                </div>
                <span className='ml-3 hidden text-sm font-medium text-gray-700 lg:block'>
                  <span className='sr-only'>Open user menu for </span>Hi,{" "}
                  {user?.name?.split(" ")[0]}
                </span>
                <ChevronDownIcon
                  className='ml-1 hidden h-5 w-5 flex-shrink-0 text-gray-400 lg:block'
                  aria-hidden='true'
                />
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter='transition ease-out duration-100'
              enterFrom='transform opacity-0 scale-95'
              enterTo='transform opacity-100 scale-100'
              leave='transition ease-in duration-75'
              leaveFrom='transform opacity-100 scale-100'
              leaveTo='transform opacity-0 scale-95'
            >
              <Menu.Items className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href='/profile'
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-700",
                      )}
                    >
                      <span className='flex'>
                        <UserCircleIcon className='w-6 text-darkblue stroke-1' />
                        <p className='pl-2'>Your Profile</p>
                      </span>
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href='#'
                      className={classNames(
                        active ? "bg-gray-100" : "",
                        "block px-4 py-2 text-sm text-gray-700",
                      )}
                    >
                      <span className='flex'>
                        <Cog6ToothIcon className='w-6 text-darkblue stroke-1' />
                        <p className='pl-2'> Settings</p>
                      </span>{" "}
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <span
                      onClick={() => logout()}
                      className={classNames(
                        active ? "bg-red-200 w-full" : "",
                        "block px-4 py-2 text-sm text-gray-700",
                      )}
                    >
                      <span className='flex '>
                        <ArrowRightOnRectangleIcon className='w-6 text-gray-700' />
                        <p className='pl-2'>Logout</p>{" "}
                      </span>
                    </span>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </>
  );
}
