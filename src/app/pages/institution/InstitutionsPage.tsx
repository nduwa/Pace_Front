import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState, SetStateAction, Dispatch, FC } from "react";
import Protected from "../../components/auth/Protected";
import Button from "../../components/common/form/Button";
import { IInstitution, IInstitutionResponse, IPaged } from "../../types/common";
import { getInstitutions } from "../../apis/institution";
import { INSTITUTIONS } from "../../utils/constants/queryKeys";
import PageContent from "../../components/common/PageContent";
import Modal from "../../components/common/Modal";
import InstitutionForm from "../../components/institution/InstitutionForm";
import Table from "../../components/table/Table";
import TableActions from "../../components/table/TableActions";
import InstitutionTableActions from "../../components/institution/InstitutionTableActions";

interface IActionComponent {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Filters = () => {
  return <div>Filters component</div>;
};

const ActionsComponent: FC<IActionComponent> = ({ setIsOpen }) => {
  const openCreateInstitutionModal = () => {
    setIsOpen(true);
  };
  return (
    <>
      <Protected permissions={["UPDATE_INSTITUTIONS"]}>
        <Button onClick={openCreateInstitutionModal} label='Add institution' />
      </Protected>
    </>
  );
};

const InstitutionsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<IPaged<IInstitutionResponse>>();
  const [keyword, setKeyword] = useState<string>();
  const { isLoading, data: response } = useQuery({
    queryFn: () => getInstitutions(""),
    queryKey: INSTITUTIONS,
  });
  const institutionsMutation = useMutation(getInstitutions);
  const handleSearch = (searchq: string) => {
    setKeyword(searchq);
    institutionsMutation.mutate(`?searchq=${searchq}&page=1`, {
      onSuccess(result) {
        setData(result);
      },
    });
  };
  const onChangePage = (page: number) => {
    institutionsMutation.mutate(
      `?page=${page}${keyword ? `&searchq=${keyword}` : ``}`,
      {
        onSuccess(result) {
          setData(result);
        },
      },
    );
  };
  useEffect(() => {
    if (response) {
      setData(response);
    }
  }, [response]);

  return (
    <PageContent
      isLoading={isLoading}
      title='Institutions'
      actionsComponent={<ActionsComponent setIsOpen={setIsOpen} />}
    >
      <>
        <Protected permissions={["UPDATE_INSTITUTIONS"]}>
          <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title='Create institution'
          >
            <InstitutionForm setIsOpen={setIsOpen} />
          </Modal>
        </Protected>

        <Table
          isLoading={isLoading}
          currentPage={data?.currentPage || 1}
          totalItems={data?.totalItems || 30}
          itemsPerPage={data?.itemsPerPage || 15}
          onChangePage={onChangePage}
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
              title: "Branches",
              key: "",
              render: (row: IInstitution) => <span>{row.branches?.length}</span>,
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
          data={data?.data.rows || []}
          searchFun={handleSearch}
          filtersComponent={<Filters />}
        />
      </>
    </PageContent>
  );
};

export default InstitutionsPage;
