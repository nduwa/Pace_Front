import { AuthContext } from "../../context/Auth";
import { useContext } from "react";
import ProfileAvatar from "./ProfileAvatar";

type ProfileFields = {
  Phone: string;
  Email: string;
  [key: string]: string;
};

export default function UserProfile() {
  const data = useContext(AuthContext);

  const names = data?.userProfile?.name;

  const userProfile = {
    Phone: data?.userProfile?.phone || "N/A",
    Email: data?.userProfile?.email || "N/A",
  } as ProfileFields;

  return (
    <div>
      <div className='py-6 px-4 sm:p-6 lg:pb-8'>
        <div className='overflow-hidden rounded-lg bg-white'>
          <h2 className='sr-only' id='profile-overview-title'>
            Profile Overview
          </h2>
          <div className='bg-white p-6'>
            <div className='sm:flex sm:items-center sm:justify-between'>
              <div className='sm:flex sm:space-x-5'>
                <div className='flex-shrink-0'>
                  <ProfileAvatar color='#0369a1' name='User' size='w-10 h-10' />
                </div>

                <div className='mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left'>
                  <p className='pt-6 text-xl font-bold text-gray-900 sm:text-2xl'>
                    {names}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8'>
            <dl className='grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2'>
              {Object.keys(userProfile).map((field) => (
                <div key={field} className='sm:col-span-1'>
                  <dt className='text-sm font-medium text-gray-500'>{field}</dt>
                  <dd className='mt-1 text-sm text-gray-900'>
                    {userProfile[field]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
