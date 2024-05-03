import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState, SetStateAction, Dispatch, FC } from "react";
import Protected from "../../components/auth/Protected";
import Button from "../../components/common/form/Button";
import { IPaged } from "../../types/common";
import { PATIENTS } from "../../utils/constants/queryKeys";
import PageContent from "../../components/common/PageContent";
import Modal from "../../components/common/Modal";
import Table from "../../components/table/Table";
import TableActions from "../../components/table/TableActions";
import { IPatient, IPatientsResponse } from "../../types/pharmacy";
import { getPatients } from "../../apis/patients";
import PatientForm from "../../components/patients/PatientForm";
import PatientTableActions from "../../components/patients/PatientTableActions";

interface IActionComponent {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const Filters = () => {
  return <div>Filters component</div>;
};

const ActionsComponent: FC<IActionComponent> = ({ setIsOpen }) => {
  const openCreatePatientModal = () => {
    setIsOpen(true);
  };
  return (
    <>
      <Protected permissions={["UPDATE_PATIENTS"]}>
        <Button onClick={openCreatePatientModal} label='Add patient' />
      </Protected>
    </>
  );
};

const PatientsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<IPaged<IPatientsResponse>>();
  const [keyword, setKeyword] = useState<string>();
  const { isLoading, data: response } = useQuery({
    queryFn: () => getPatients(""),
    queryKey: PATIENTS,
  });
  const patientsMutation = useMutation(getPatients);
  const handleSearch = (searchq: string) => {
    setKeyword(searchq);
    patientsMutation.mutate(`?searchq=${searchq}&page=1`, {
      onSuccess(result) {
        setData(result);
      },
    });
  };
  const onChangePage = (page: number) => {
    patientsMutation.mutate(`?page=${page}${keyword ? `&searchq=${keyword}` : ``}`, {
      onSuccess(result) {
        setData(result);
      },
    });
  };
  useEffect(() => {
    if (response) {
      setData(response);
    }
  }, [response]);

  return (
    <PageContent
      isLoading={isLoading}
      title='Patients'
      actionsComponent={<ActionsComponent setIsOpen={setIsOpen} />}
    >
      <>
        <Protected permissions={["UPDATE_PATIENTS"]}>
          <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title='Create patient'
          >
            <PatientForm setIsOpen={setIsOpen} />
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
              title: "PatientNO",
              key: "patientNO",
            },
            {
              title: "Name",
              key: "name",
            },
            {
              title: "Phone",
              key: "phone",
            },
            {
              title: "NID",
              key: "NID",
            },
            {
              title: "Index",
              key: "NIDIndex",
            },

            {
              title: "Dependents",
              key: "dependents",
              render: (row: IPatient) => row?.dependents?.length,
            },
            {
              title: "Actions",
              key: "actions",
              render: (row: IPatient) => {
                return (
                  <TableActions>
                    <PatientTableActions patient={row} />
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

export default PatientsPage;
