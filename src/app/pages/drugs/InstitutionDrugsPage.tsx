import { Tab } from "@headlessui/react";
import TabLink from "../../components/common/TabLink";
import InstitutionDrugsGrouped from "./InstitutionDrugsGrouped";
import InstitutionDrugsBatches from "./InstitutionDrugsBatches";
import Protected from "../../components/auth/Protected";
import Button from "../../components/common/form/Button";

const InstitutionDrugsPage = () => {
  return (
    <>
      <div className='px-4 sm:px-6 lg:px-8'>
        <Tab.Group>
          <Tab.List className={"border-b"}>
            <div className='flex justify-between'>
              <div>
                <TabLink label='Grouped' />
                <TabLink label='Batch based' />
              </div>
              <div>
                <Protected permissions={["PURCHASE_MEDECINES"]}>
                  <Button to='/drugs/orders/add' label='Add' />
                </Protected>
              </div>
            </div>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <InstitutionDrugsGrouped />
            </Tab.Panel>
            <Tab.Panel>
              <InstitutionDrugsBatches />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  );
};

export default InstitutionDrugsPage;
