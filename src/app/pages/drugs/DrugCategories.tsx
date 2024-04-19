import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState, SetStateAction, Dispatch, FC } from "react";
import Protected from "../../components/auth/Protected";
import Button from "../../components/common/form/Button";
import { IPaged } from "../../types/common";
import { getdrugCategories } from "../../apis/drug";
import { DRUGS_CATEGORIES } from "../../utils/constants/queryKeys";
import PageContent from "../../components/common/PageContent";
import Modal from "../../components/common/Modal";
import Table from "../../components/table/Table";
import TableActions from "../../components/table/TableActions";
import { IDrugCategory, IDrugCategoryResponse } from "../../types/pharmacy";
import DrugCategoryTableActions from "../../components/drugs/DrugCategoryTableActions";
import DrugCategoryForm from "../../components/drugs/DrugCategoryForm";

interface IActionComponent {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const ActionsComponent: FC<IActionComponent> = ({ setIsOpen }) => {
  const openCreateDrugModal = () => {
    setIsOpen(true);
  };
  return (
    <>
      <Protected permissions={["UPDATE_MEDECINES"]}>
        <Button onClick={openCreateDrugModal} label='Add category' />
      </Protected>
    </>
  );
};

const DrugsCategoriesPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<IPaged<IDrugCategoryResponse>>();
  const { isLoading, data: response } = useQuery({
    queryFn: () => getdrugCategories(""),
    queryKey: DRUGS_CATEGORIES,
  });
  const drugsMutation = useMutation(getdrugCategories);

  const onChangePage = (page: number) => {
    drugsMutation.mutate(
      `?page=${page}
      `,
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

  const columns = [
    {
      title: "Name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (row: IDrugCategory) => {
        return (
          <TableActions>
            <DrugCategoryTableActions category={row} />
          </TableActions>
        );
      },
    },
  ];
  return (
    <PageContent
      isLoading={isLoading}
      title='Categories'
      actionsComponent={<ActionsComponent setIsOpen={setIsOpen} />}
    >
      <>
        <Protected permissions={["UPDATE_MEDECINES"]}>
          <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title='Create category'
          >
            <DrugCategoryForm setIsOpen={setIsOpen} />
          </Modal>
        </Protected>

        <Table
          isLoading={isLoading || drugsMutation.isLoading}
          currentPage={data?.currentPage || 1}
          totalItems={data?.totalItems || 30}
          itemsPerPage={data?.itemsPerPage || 15}
          onChangePage={onChangePage}
          columns={columns}
          data={data?.data.rows || []}
        />
      </>
    </PageContent>
  );
};

export default DrugsCategoriesPage;
