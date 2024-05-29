import { useState, SetStateAction, Dispatch, FC, useContext } from "react";
import Button from "../../components/common/form/Button";
import { IInstitution } from "../../types/common";
import PageContent from "../../components/common/PageContent";
import Modal from "../../components/common/Modal";
import Table from "../../components/table/Table";
import TableActions from "../../components/table/TableActions";
import InstitutionTableActions from "../../components/institution/InstitutionTableActions";
import { AuthContext } from "../../context/Auth";
import BranchForm from "../../components/institution/BranchForm";
import { SyncLoader } from "react-spinners";

interface IActionComponent {
  institution?: IInstitution;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const ActionsComponent: FC<IActionComponent> = ({ institution, setIsOpen }) => {
  const openCreateInstitutionModal = () => {
    setIsOpen(true);
  };
  return (
    <>
      {institution && institution.institutionId === null && (
        <Button onClick={openCreateInstitutionModal} label='Add branch' />
      )}
    </>
  );
};

const BranchesPage = () => {
  const user = useContext(AuthContext)?.userProfile;
  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return <SyncLoader color='#6DAB3C' />;
  }

  return (
    <PageContent
      isLoading={!user}
      title='Branches'
      actionsComponent={
        <ActionsComponent setIsOpen={setIsOpen} institution={user.institution} />
      }
    >
      <>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title='Create Branch'
        >
          <BranchForm setIsOpen={setIsOpen} />
        </Modal>

        <Table
          isLoading={!user}
          columns={[
            {
              title: "Name",
              key: "name",
            },
            {
              title: "Type",
              key: "institutionType",
            },
            {
              title: "Contact",
              key: "",
              render: (row: IInstitution) => (
                <div className='flex flex-col'>
                  <div>{row.admin.email}</div>
                  <div>{row.admin.phone}</div>
                </div>
              ),
            },
            {
              title: "Admin",
              key: "",
              render: (row: IInstitution) => (
                <div className='flex flex-col'>
                  <div>{row.admin.email}</div>
                </div>
              ),
            },
            {
              title: "Details",
              key: "",
              render: (row: IInstitution) => (
                <div className='flex flex-col'>
                  <div>{row.details.TIN}</div>
                  <div>{row.details.location}</div>
                </div>
              ),
            },
            {
              title: "Actions",
              key: "actions",
              render: (row: IInstitution) => {
                return (
                  <TableActions>
                    <InstitutionTableActions institution={row} />
                  </TableActions>
                );
              },
            },
          ]}
          data={user?.institution.branches || []}
        />
      </>
    </PageContent>
  );
};

export default BranchesPage;
