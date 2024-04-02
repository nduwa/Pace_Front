import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../apis/users";
import { IUserProfile } from "../../types/common";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

interface GetUserDetailsProps {
  userId: string;
}

const GetUserDetails: React.FC<GetUserDetailsProps> = ({ userId }) => {
  const {
    data: user,
    isLoading,
    error,
  } = useQuery<IUserProfile, Error>(["user", userId], () => getUser(userId));

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>Loading...</div>
    );
  }

  if (error) {
    return (
      <div className='text-red-500 text-center mt-4'>Error: {error.message}</div>
    );
  }

  return (
    <>
      <ul>
        <li className='col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white shadow'>
          <div className='flex flex-1 flex-col p-8'>
            <h3 className='mt-6 text-xl font-medium text-gray-900'>{user?.name}</h3>
          </div>
          <div>
            <div className='-mt-px flex divide-x divide-gray-200'>
              <div className='flex w-0 flex-1'>
                <a
                  href={`mailto:${user?.email}`}
                  className='relative -mr-px inline-flex w-0 flex-1 items-center justify-center rounded-bl-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500'
                >
                  <EnvelopeIcon
                    className='h-5 w-5 text-gray-400'
                    aria-hidden='true'
                  />
                  <span className='ml-3'>{user?.email || "N/A"}</span>
                </a>
              </div>
              <div className='-ml-px flex w-0 flex-1'>
                <a
                  href={`tel:${user?.phone || "N/A"}`}
                  className='relative inline-flex w-0 flex-1 items-center justify-center rounded-br-lg border border-transparent py-4 text-sm font-medium text-gray-700 hover:text-gray-500'
                >
                  <PhoneIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
                  <span className='ml-3'>{user?.phone || "N/A"}</span>
                </a>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
};

export default GetUserDetails;
