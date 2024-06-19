import { useContext } from "react";

import PageContent from "../../components/common/PageContent";
import InstitutionDetails from "../../components/institution/InstitutionDetail";
import { Tab } from "@headlessui/react";
import TabLink from "../../components/common/TabLink";
import { AuthContext } from "../../context/Auth";
import Protected from "../../components/auth/Protected";
import InstitutionUpdate from "../../components/institution/InstitutionUpdate";
import Forbidden from "../../components/auth/Forbidden";

const SettingPage = () => {
  const user = useContext(AuthContext)?.userProfile;

  return (
    <PageContent title='Institution setting' showHeaderElement={false}>
      <div className='px-4 sm:px-6 lg:px-8'>
        {user && (
          <Protected permissions={["INSTITUTION_ADMIN"]}>
            {user.institution && (
              <>
                <Tab.Group>
                  <Tab.List className={"border-b"}>
                    <TabLink label='Details' />
                    <TabLink label='Update' />
                  </Tab.List>
                  <Tab.Panels>
                    <Tab.Panel>
                      <InstitutionDetails institution={user.institution} />
                    </Tab.Panel>
                    <Tab.Panel>
                      <InstitutionUpdate institution={user.institution} />
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </>
            )}
            {!user.institution && <Forbidden />}
          </Protected>
        )}
      </div>
    </PageContent>
  );
};

export default SettingPage;
