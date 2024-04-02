import { useState } from "react";
import { KeyIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import UserProfile from "../../components/profile/UserProfile";
import UpdatePassword from "../../components/auth/UpdatePassword";
import PageContent from "../../components/common/PageContent";

const handlePasswordUpdateSuccess = () => {
  console.log("Password updated successfully");
};

const tabs = [
  {
    name: "Personal Info",
    href: "/profile",
    icon: UserCircleIcon,
    component: UserProfile,
    props: {},
  },
  {
    name: "Password",
    href: "/update-password",
    icon: KeyIcon,
    component: UpdatePassword,
    props: { onSuccess: handlePasswordUpdateSuccess },
  },
];

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  const ActiveComponent = tabs.find((tab) => tab.name === activeTab)?.component;

  return (
    <PageContent title='Your Profile'>
      <div>
        <main className='relative'>
          <div className='mx-auto max-w-screen-xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-16'>
            <div className='overflow-hidden rounded-lg bg-white shadow'>
              <div>
                <div className='mt-3 sm:mt-2'>
                  <div className='flex flex-auto'>
                    <div className='flex items-center pl-6 border-b border-gray-200'>
                      <nav
                        className='-mb-px flex flex-1 flex-col md:flex-row  space-x-6 xl:space-x-8'
                        aria-label='Tabs'
                      >
                        {tabs.map((tab) => (
                          <a
                            key={tab.name}
                            href={tab.href}
                            aria-current={
                              tab.name === activeTab ? "page" : undefined
                            }
                            className={classNames(
                              tab.name === activeTab
                                ? "border-semiPrimary text-darkblue"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                              "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm",
                            )}
                            onClick={(e) => {
                              e.preventDefault();
                              setActiveTab(tab.name);
                            }}
                          >
                            <span className='flex items-center'>
                              <tab.icon
                                className={classNames(
                                  tab.name === activeTab
                                    ? "text-darkblue group-hover:text-teal-500"
                                    : "text-gray-400 group-hover:text-gray-500",
                                  "flex-shrink-0 -ml-1 mr-3 h-6 w-6",
                                )}
                                aria-hidden='true'
                              />
                              <span className='truncate'>{tab.name}</span>
                            </span>
                          </a>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
              <div className=' divide-gray-200  lg:divide-x'>
                <div>
                  {ActiveComponent && (
                    <ActiveComponent
                      {...tabs.find((tab) => tab.name === activeTab)?.props}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageContent>
  );
}
