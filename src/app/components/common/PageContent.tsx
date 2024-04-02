import { ReactNode, FC, useEffect } from "react";
import SyncLoader from "react-spinners/PulseLoader";

interface IPageContent {
  title: string;
  actionsComponent?: ReactNode;
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
  showHeaderElement?: boolean;
}
const PageContent: FC<IPageContent> = ({ showHeaderElement = true, ...Props }) => {
  useEffect(() => {
    document.title = Props.title;
  }, [Props.title]);
  return (
    <>
      <div className={"px-4 sm:px-6 lg:px-8 " + Props.className}>
        {showHeaderElement && (
          <div className='sm:flex sm:items-center'>
            <div className='sm:flex-auto'>
              <h1 className='text-xl font-semibold text-gray-900'>{Props.title}</h1>
            </div>
            <div className='mt-4 sm:mt-0 sm:ml-16 sm:flex-none'>
              <div className='flex gap-5'>{Props.actionsComponent}</div>
            </div>
          </div>
        )}
        <div className='mt-8 flex flex-col'>
          <div className='-my-2 -mx-4 sm:-mx-6 lg:-mx-8'>
            <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
              {Props.isLoading && (
                <div className='flex justify-center mb-3'>
                  <SyncLoader color='#6DAB3C' />
                </div>
              )}
              <div
                className={`${Props.isLoading ? "hidden" : "w-full"} ${
                  Props.className
                }`}
              >
                {Props.children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageContent;
