import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, SetStateAction, Dispatch, FC, useEffect } from "react";
import Button from "../../components/common/form/Button";
import {
  ITransaction,
  ITransactionResponse,
  IPaged,
  ITransactionDTO,
} from "../../types/common";
import { getTransactions } from "../../apis/transaction";
// import { TRANSACTIONS } from "../../utils/constants/queryKeys";
import PageContent from "../../components/common/PageContent";
import Modal from "../../components/common/Modal";
import Table from "../../components/table/Table";
import TableActions from "../../components/table/TableActions";
import TransactionForm from "../../components/transactions/TransactionForm";
import TransactionTableActions from "../../components/transactions/TransactionTableActions";
import { TRANSACTIONS } from "../../utils/constants/queryKeys";
import { format } from "date-fns";
import TransactionTableFilters from "../../components/transactions/TransactionTableFilters";

interface IActionComponent {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const ActionsComponent: FC<IActionComponent> = ({ setIsOpen }) => {
  const openCreateTransactionModal = () => {
    setIsOpen(true);
  };
  return (
    <>
      <Button onClick={openCreateTransactionModal} label='Add transaction' />
    </>
  );
};

const TransactionsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<IPaged<ITransactionResponse>>();
  const [keyword, setKeyword] = useState<string>();
  const [filters, setFilters] = useState<string>();

  const [filtersLoading, setFiltersLoading] = useState<boolean>(false);
  const { isLoading, data: response } = useQuery({
    queryFn: () => getTransactions(""),
    queryKey: TRANSACTIONS,
  });
  const transactionsMutation = useMutation(getTransactions);
  const handleSearch = (searchq: string) => {
    setKeyword(searchq);
    transactionsMutation.mutate(`?searchq=${searchq}&page=1&${filters}`, {
      onSuccess(result) {
        setData(result);
      },
    });
  };

  const handleFilter = (appliedFilters: string) => {
    setFilters(appliedFilters);
    setFiltersLoading(true);
    transactionsMutation.mutate(`?searchq=${keyword || ""}&${appliedFilters}`, {
      onSuccess(result) {
        setFiltersLoading(false);
        setData(result);
      },
      onError() {
        setFiltersLoading(false);
      },
    });
  };
  const onChangePage = (page: number) => {
    transactionsMutation.mutate(
      `?page=${page}${keyword ? `&searchq=${keyword}` : ``}&${filters}`,
      {
        onSuccess(result) {
          setData(result);
        },
      },
    );
  };
  const defaultFilters = data?.data
    ? {
        type: data.data.type,
        startDate: data.data.startDate,
        endDate: data.data.endDate,
      }
    : undefined;
  useEffect(() => {
    if (response) {
      setData(response);
    }
  }, [response]);

  return (
    <PageContent
      isLoading={isLoading}
      title='Transactions'
      actionsComponent={<ActionsComponent setIsOpen={setIsOpen} />}
    >
      <>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title='Create transaction'
        >
          <TransactionForm setIsOpen={setIsOpen} />
        </Modal>

        <Table
          isLoading={isLoading}
          hideFilters={!filtersLoading}
          currentPage={data?.currentPage || 1}
          totalItems={data?.totalItems || 30}
          itemsPerPage={data?.itemsPerPage || 15}
          onChangePage={onChangePage}
          columns={[
            {
              title: "Name",
              key: "reason",
            },
            {
              title: "Amount",
              key: "amount",
            },
            {
              title: "Reference",
              key: "reference",
            },
            {
              title: "Type",
              key: "type",
            },
            {
              title: "Date",
              key: "",
              render: (row: ITransaction) => (
                <>{format(new Date(row.createdAt), "dd-MM-yyyy")}</>
              ),
            },
            {
              title: "By",
              key: "amount",
              render: (row: ITransactionDTO) => row.user.name,
            },

            {
              title: "Actions",
              key: "actions",
              render: (row: ITransaction) => {
                return (
                  <TableActions>
                    <TransactionTableActions transaction={row} />
                  </TableActions>
                );
              },
            },
          ]}
          data={data?.data.rows || []}
          searchFun={handleSearch}
          filtersComponent={
            <TransactionTableFilters
              isLoading={filtersLoading}
              defaultValues={defaultFilters}
              filterFunc={handleFilter}
            />
          }
        />
      </>
    </PageContent>
  );
};

export default TransactionsPage;
