import { useMutation, useQuery } from "@tanstack/react-query";
import PageContent from "../../components/common/PageContent";
import Table from "../../components/table/Table";
import { getAllUsers } from "../../apis/users";
import { ALL_USERS } from "../../utils/constants/queryKeys";
import { IPaged, IUserProfile, IUsersResponse } from "../../types/common";
import { useEffect, useState } from "react";
import TableActions from "../../components/table/TableActions";
import UsersTableActions from "../../components/users/UsersTableActions";
import UsersPageActions from "../../components/users/UsersPageActions";

const UsersPage = () => {
  const [data, setData] = useState<IPaged<IUsersResponse>>();
  const [filters] = useState<string>();
  const [filtersLoading] = useState<boolean>(false);
  const [keyword, setKeyword] = useState<string>();
  const { isLoading, data: response } = useQuery({
    queryFn: () => getAllUsers(),
    queryKey: ALL_USERS,
  });

  useEffect(() => {
    setData(response);
  }, [response]);

  const usersMutation = useMutation(getAllUsers);
  const handleSearch = (searchq: string) => {
    setKeyword(searchq);
    usersMutation.mutate(
      `?searchq=${searchq}&page=1${filters ? `&${filters}` : ``}`,
      {
        onSuccess(result) {
          setData(result);
        },
      },
    );
  };
  const onChangePage = (page: number) => {
    usersMutation.mutate(
      `?page=${page}${keyword ? `&searchq=${keyword}` : ``}${
        filters ? `&${filters}` : ``
      }`,
      {
        onSuccess(result) {
          setData(result);
        },
      },
    );
  };

  const columns = [
    {
      title: "Names",
      key: "",
      render: (row: IUserProfile) => row.name,
    },
    { title: "Phone", key: "phone" },
    { title: "Email", key: "email" },
    {
      title: "Actions",
      key: "",
      render: (row: IUserProfile) => (
        <TableActions>
          <UsersTableActions user={row} />
        </TableActions>
      ),
    },
  ];

  return (
    <PageContent
      title='Users'
      isLoading={isLoading}
      actionsComponent={<UsersPageActions />}
    >
      <Table
        hideFilters={!filtersLoading}
        isLoading={isLoading || usersMutation.isLoading}
        currentPage={data?.currentPage || 1}
        totalItems={data?.totalItems}
        itemsPerPage={data?.itemsPerPage || 15}
        onChangePage={onChangePage}
        columns={columns}
        data={data?.data.rows || []}
        searchFun={handleSearch}
        usedFilters={filters}
      />
    </PageContent>
  );
};

export default UsersPage;
