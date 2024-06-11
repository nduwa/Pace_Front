import { useQuery } from "@tanstack/react-query";
import PageContent from "../../components/common/PageContent";
import Table from "../../components/table/Table";
import { IForm } from "../../types/forms";
import { format } from "date-fns";
import { getFormsByLocation } from "../../apis/forms";
import FormDrawer from "../../components/forms/FormDrawer";
import FormDetails from "../../components/forms/FormDetails";
import Status from "../../components/common/Status";
import SendForm from "../../components/forms/SendForm";
import { Link, useParams } from "react-router-dom";
import { PencilIcon } from "@heroicons/react/24/outline";

const FormActions = () => {
  return <></>;
};

const FormsLocationPage = () => {
  const { location } = useParams();
  const { data, isLoading } = useQuery({
    queryFn: () => getFormsByLocation(`${location}`),
    queryKey: [`forms_at_${location}`],
  });

  return (
    <PageContent
      title={`Forms at ${location}`}
      isLoading={isLoading}
      actionsComponent={<FormActions />}
    >
      <Table
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
                      <PencilIcon className='w-5 text-green' />
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
        data={data ?? []}
      />
    </PageContent>
  );
};

export default FormsLocationPage;
