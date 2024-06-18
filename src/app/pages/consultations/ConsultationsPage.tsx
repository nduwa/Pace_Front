import { useMutation, useQuery } from "@tanstack/react-query";
import {
  useState,
  SetStateAction,
  Dispatch,
  FC,
  useEffect,
  useContext,
} from "react";
import Button from "../../components/common/form/Button";
import { IConsultation, IConsultationResponse, IPaged } from "../../types/common";
import PageContent from "../../components/common/PageContent";
import Modal from "../../components/common/Modal";
import Table from "../../components/table/Table";
import TableActions from "../../components/table/TableActions";
import ConsultationForm from "../../components/consultations/ConsultationForm";
import { CONSULTATIONS } from "../../utils/constants/queryKeys";
import { getConsultations } from "../../apis/consultation";
import ConsultationTableActions from "../../components/consultations/ConsulttionTableActions";
import Protected from "../../components/auth/Protected";
import { AuthContext } from "../../context/Auth";
import Forbidden from "../../components/auth/Forbidden";

interface IActionComponent {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const ActionsComponent: FC<IActionComponent> = ({ setIsOpen }) => {
  const openCreateConsultationModal = () => {
    setIsOpen(true);
  };
  return (
    <>
      <Protected permissions={["INSTITUTION_ADMIN"]}>
        <Button onClick={openCreateConsultationModal} label='Add consultation' />
      </Protected>
    </>
  );
};

const ConsultationsPage = () => {
  const user = useContext(AuthContext)?.userProfile;
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<IPaged<IConsultationResponse>>();
  const [keyword, setKeyword] = useState<string>();
  const { isLoading, data: response } = useQuery({
    queryFn: () => getConsultations(""),
    queryKey: CONSULTATIONS,
  });
  const consultationsMutation = useMutation(getConsultations);
  const handleSearch = (searchq: string) => {
    setKeyword(searchq);
    consultationsMutation.mutate(`?searchq=${searchq}&page=1`, {
      onSuccess(result) {
        setData(result);
      },
    });
  };
  const onChangePage = (page: number) => {
    consultationsMutation.mutate(
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
      title='Consultations'
      actionsComponent={<ActionsComponent setIsOpen={setIsOpen} />}
    >
      <>
        {user && user.institution.institutionType !== "CLINIC" && <Forbidden />}

        {user && user.institution.institutionType === "CLINIC" && (
          <>
            <Modal
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              title='Create consultation'
            >
              <ConsultationForm setIsOpen={setIsOpen} />
            </Modal>

            <Table
              isLoading={isLoading}
              currentPage={data?.currentPage || 1}
              totalItems={data?.totalItems || 30}
              itemsPerPage={data?.itemsPerPage || 15}
              onChangePage={onChangePage}
              columns={[
                {
                  title: "Label",
                  key: "label",
                },
                {
                  title: "Price",
                  key: "price",
                },
                {
                  title: "Actions",
                  key: "actions",
                  render: (row: IConsultation) => {
                    return (
                      <TableActions>
                        <ConsultationTableActions consultation={row} />
                      </TableActions>
                    );
                  },
                },
              ]}
              data={data?.data.rows || []}
              searchFun={handleSearch}
            />
          </>
        )}
      </>
    </PageContent>
  );
};

export default ConsultationsPage;
