import React, { FC, ReactNode } from "react";
import { Transition } from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/24/solid";
interface IDrawerProps {
  onClose: () => void;
  open: boolean;
  DrawerContent: ReactNode;
  large?: boolean;
  closeDrawer?: () => void;
}

const Drawer: FC<IDrawerProps> = ({
  open,
  onClose,
  DrawerContent,
  large,
  closeDrawer,
}) => {
  const width = large ? "w-4/6" : "w-5/6 md:w-1/2 lg:w-2/6";
  const renderDrawerContent = () => {
    if (React.isValidElement(DrawerContent)) {
      const Component = DrawerContent.type as React.ComponentType<unknown>;
      return <Component closeDrawer={closeDrawer} {...DrawerContent.props} />;
    } else {
      return DrawerContent;
    }
  };
  return (
    <div className='relative'>
      <Transition show={open} as={React.Fragment}>
        <div className='fixed inset-0 overflow-hidden z-50'>
          <Transition.Child
            as={React.Fragment}
            leaveTo='opacity-0'
            enterTo='opacity-100'
            enterFrom='opacity-0'
            leaveFrom='opacity-100'
            enter='transition-opacity duration-300'
            leave='transition-opacity duration-300'
          >
            <div className='absolute inset-0 bg-black opacity-50'></div>
          </Transition.Child>
          <Transition.Child
            as={React.Fragment}
            enterTo='translate-x-0'
            leaveTo='translate-x-full'
            leaveFrom='translate-x-0'
            enterFrom='translate-x-full'
            enter='transition-transform duration-300'
            leave='transition-transform duration-300'
          >
            <div
              className={`absolute max-w-[700px] inset-y-0 right-0 ${width} overflow-auto   bg-white shadow-lg p-6`}
            >
              <div className='flex justify-between items-center mb-3'>
                <XCircleIcon
                  onClick={onClose}
                  title='Close'
                  className='w-8 p-1 cursor-pointer hover:text-darkblue text-darkblue'
                />
              </div>
              {renderDrawerContent()}
            </div>
          </Transition.Child>
        </div>
      </Transition>
    </div>
  );
};

export default Drawer;
