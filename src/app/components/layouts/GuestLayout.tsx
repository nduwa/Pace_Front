import { Outlet } from "react-router-dom";
import logo from "../../assets/logo-white.png";

const GuestLayout = () => {
  return (
    <>
      <main className='h-full w-full min-h-full flex items-center justify-center guest-home'>
        <div className='flex justify-between w-full max-w-[1000px] gap-[20px] items-center'>
          <div className='flex flex-col space-y-8 text-white max-w-[400px]'>
            <div className='flex space-x-10 items-center'>
              <img src={logo} alt='' className='w-auto h-10' />
              <div className='text-3xl font-medium'>DigitalMed</div>
            </div>
            <div className='text-md font-normal'>
              Streamlining the billing and claims processing for healthcare services
            </div>
          </div>
          <div className='bg-white max-w-md px-12 py-6 pb-12 rounded-lg'>
            <Outlet />
          </div>
        </div>
      </main>
    </>
  );
};

export default GuestLayout;
