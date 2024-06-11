import { useMutation, useQuery } from "@tanstack/react-query";
import Protected from "../../components/auth/Protected";
import Button from "../../components/common/form/Button";
import { FORMS } from "../../utils/constants/queryKeys";
import PageContent from "../../components/common/PageContent";
import Table from "../../components/table/Table";
import { IForm, IFormResponse } from "../../types/forms";
import { format } from "date-fns";
import { IPaged } from "../../types/common";
import { useEffect, useState } from "react";
import { getForms } from "../../apis/forms";
import FormDrawer from "../../components/forms/FormDrawer";
import FormDetails from "../../components/forms/FormDetails";
import FormTableFilters from "../../components/forms/FormTableFilters";
import Status from "../../components/common/Status";
import SendForm from "../../components/forms/SendForm";
import { EyeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const FormActions = () => {
  return (
    <Protected permissions={["RECEIPTION"]}>
      <Button to='/forms/new' label='Add' />
    </Protected>
  );
};

const FormsPage = () => {
  const [data, setData] = useState<IPaged<IFormResponse>>();
  const [filters, setFilters] = useState<string>();
  const [filtersLoading, setFiltersLoading] = useState<boolean>(false);
  const { data: response, isLoading } = useQuery({
    queryFn: () => getForms(),
    queryKey: FORMS,
  });

  const formsMutation = useMutation(getForms);

  const onChangePage = (page: number) => {
    formsMutation.mutate(`?page=${page}${filters ? `&${filters}` : ``}`, {
      onSuccess(result) {
        setData(result);
      },
    });
  };

  const handleFilter = (appliedFilters: string) => {
    setFilters(appliedFilters);
    setFiltersLoading(true);
    formsMutation.mutate(`?${appliedFilters}`, {
      onSuccess(result) {
        setFiltersLoading(false);
        setData(result);
      },
      onError() {
        setFiltersLoading(false);
      },
    });
  };

  const defaultFilters = data?.data
    ? {
        at: data.data.at,
        isOpen: data.data.isOpen,
      }
    : undefined;

  useEffect(() => {
    if (response) {
      setData(response);
    }
  }, [response]);

  return (
    <PageContent
      title='Forms'
      isLoading={isLoading}
      actionsComponent={<FormActions />}
    >
      <Table
        hideFilters={!filtersLoading}
        onChangePage={onChangePage}
        currentPage={data?.currentPage || 1}
        totalItems={data?.totalItems || 30}
        itemsPerPage={data?.itemsPerPage || 15}
        filtersComponent={
          <FormTableFilters
            isLoading={filtersLoading}
            defaultValues={defaultFilters}
            filterFunc={handleFilter}
          />
        }
        columns={[
          { title: "FormNO", key: "formNO" },
          {
            title: "Date",
            key: "date",
            render: (form: IForm) => (
              <p>{format(new Date(form.createdAt), "dd-MM-yyyy")}</p>
            ),
          },
          { title: "At", key: "at" },
          {
            title: "Patient",
            key: "patient",
            render: (form: IForm) => <p>{form.patient.name}</p>,
          },
          {
            title: "Status",
            key: "status",
            render: (row: IForm) => (
              <>
                <Status
                  status={row.isOpen === true}
                  trueText='Open'
                  falseText='Archived'
                />
              </>
            ),
          },
          {
            title: "Actions",
            key: "",
            render: (form: IForm) => (
              <div className='flex gap-1 items-center'>
                {form.isOpen !== false && (
                  <>
                    <SendForm form={form} />
                    <Link to={`/forms/${form.id}/view`}>
                      <EyeIcon className='w-5 text-green' />
                    </Link>
                  </>
                )}

                <FormDrawer>
                  <FormDetails data={form} />
                </FormDrawer>
              </div>
            ),
          },
        ]}
        data={data?.data.rows ?? []}
        usedFilters={filters}
      />
    </PageContent>
  );
};

export default FormsPage;
