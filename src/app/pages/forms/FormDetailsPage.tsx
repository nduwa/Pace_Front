import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { DRUGS_NPAGED, EXAMS_NPAGED, FORM } from "../../utils/constants/queryKeys";
import { getForm } from "../../apis/forms";
import { IFormConsultation } from "../../types/forms";
import { getexams } from "../../apis/exams";
import { getDrugsNPaged } from "../../apis/drug";
import FormConsultation from "./FormConsultation";
import { SyncLoader } from "react-spinners";
import Protected from "../../components/auth/Protected";
import FormExamination from "./FormExamination";
import { HasPermissions } from "../../helpers/HasPermissions";
import { Permission } from "../../constants/permissions";
import FormDetails from "./FormDetails";
import FormInvoicing from "./FormInvoicing";

const FormDetailsPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryFn: () => getForm(id as string),
    queryKey: FORM,
  });

  const { data: exams, isLoading: examFetching } = useQuery({
    queryFn: () => getexams(),
    queryKey: EXAMS_NPAGED,
  });

  const { data: drugs, isLoading: drugFetching } = useQuery({
    queryFn: () => getDrugsNPaged(),
    queryKey: DRUGS_NPAGED,
  });

  const isAtConsultation = () => {
    const consultations: IFormConsultation[] = data?.consultations || [];
    const consultation = consultations.find(
      (cons) => cons.consultation.label == data?.at,
    );

    return consultation !== undefined;
  };

  const permissions = HasPermissions([
    "CONSULTATION",
    "LABORATORY",
    "COUNTER",
    "RECEIPTION",
  ]);

  const isOpenable = () => {
    if (!data?.isOpen) return false;

    if (isAtConsultation()) return permissions.includes("CONSULTATION");

    return permissions.includes(data?.at as Permission);
  };

  return (
    <>
      {(isLoading || examFetching || drugFetching) && (
        <div className='flex justify-center mb-3'>
          <SyncLoader color='#6DAB3C' />
        </div>
      )}
      {data && !examFetching && !drugFetching && exams && drugs && (
        <>
          {isOpenable() && (
            <>
              {isAtConsultation() && (
                <Protected permissions={["CONSULTATION"]}>
                  <FormConsultation data={data} exams={exams} drugs={drugs} />
                </Protected>
              )}

              {data.at === "LABORATORY" && (
                <Protected permissions={["LABORATORY"]}>
                  <FormExamination data={data} />
                </Protected>
              )}

              {data.at === "COUNTER" && (
                <Protected permissions={["COUNTER"]}>
                  <FormInvoicing data={data} />
                </Protected>
              )}
            </>
          )}

          {!isOpenable() && <FormDetails data={data} />}
        </>
      )}
    </>
  );
};

export default FormDetailsPage;
