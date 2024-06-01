import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, SetStateAction, Dispatch, FC, useEffect } from "react";
import Button from "../../components/common/form/Button";
import { IPaged } from "../../types/common";
import PageContent from "../../components/common/PageContent";
import Modal from "../../components/common/Modal";
import Table from "../../components/table/Table";
import TableActions from "../../components/table/TableActions";
import ExamForm from "../../components/exams/ExamForm";
import ExamTableActions from "../../components/exams/ExamTableActions";
import { EXAMS } from "../../utils/constants/queryKeys";
import { IExam, IExamResponse } from "../../types/exams";
import { getExams } from "../../apis/exams";

interface IActionComponent {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const ActionsComponent: FC<IActionComponent> = ({ setIsOpen }) => {
  const openCreateExamModal = () => {
    setIsOpen(true);
  };
  return (
    <>
      <Button onClick={openCreateExamModal} label='Add exam' />
    </>
  );
};

const ExamsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<IPaged<IExamResponse>>();
  const [keyword, setKeyword] = useState<string>();
  const { isLoading, data: response } = useQuery({
    queryFn: () => getExams(""),
    queryKey: EXAMS,
  });
  const examsMutation = useMutation(getExams);
  const handleSearch = (searchq: string) => {
    setKeyword(searchq);
    examsMutation.mutate(`?searchq=${searchq}&page=1`, {
      onSuccess(result) {
        setData(result);
      },
    });
  };
  const onChangePage = (page: number) => {
    examsMutation.mutate(`?page=${page}${keyword ? `&searchq=${keyword}` : ``}`, {
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
      title='Exams'
      actionsComponent={<ActionsComponent setIsOpen={setIsOpen} />}
    >
      <>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title='Create exam'>
          <ExamForm setIsOpen={setIsOpen} />
        </Modal>

        <Table
          isLoading={isLoading}
          currentPage={data?.currentPage || 1}
          totalItems={data?.totalItems || 30}
          itemsPerPage={data?.itemsPerPage || 15}
          onChangePage={onChangePage}
          columns={[
            {
              title: "Code",
              key: "exam_code",
            },
            {
              title: "Name",
              key: "name",
            },
            {
              title: "Description",
              key: "description",
            },
            {
              title: "Price",
              key: "price",
            },
            {
              title: "Actions",
              key: "actions",
              render: (row: IExam) => {
                return (
                  <TableActions>
                    <ExamTableActions exam={row} />
                  </TableActions>
                );
              },
            },
          ]}
          data={data?.data.rows || []}
          searchFun={handleSearch}
        />
      </>
    </PageContent>
  );
};

export default ExamsPage;
