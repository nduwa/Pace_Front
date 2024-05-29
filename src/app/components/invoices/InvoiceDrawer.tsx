import { Square3Stack3DIcon } from "@heroicons/react/24/outline";
import { useState, PropsWithChildren, FC } from "react";
import Drawer from "../../components/drawer/Drawer";

const InvoiceDrawer: FC<PropsWithChildren> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const closeDrawer = () => {
    setOpen(false);
  };
  return (
    <>
      <div className='flex p-2'>
        <Square3Stack3DIcon
          onClick={() => setOpen(true)}
          className='h-5 text-darkblue '
        />
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          DrawerContent={children}
          closeDrawer={closeDrawer}
        />
      </div>
    </>
  );
};

export default InvoiceDrawer;
