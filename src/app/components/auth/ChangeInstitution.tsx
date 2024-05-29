import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, FC, SetStateAction } from "react";
import toast from "react-hot-toast";
import { ChangeInstitution, IInstitution } from "../../types/common";
import { USER_PROFILE } from "../../utils/constants/queryKeys";
import OptionsField from "../common/form/OptionsField";
import Button from "../common/form/Button";
import { changeInstitutionSchema } from "../../utils/schemas/auth.schema";
import { changeInstitution } from "../../apis/auth";
import { useNavigate } from "react-router-dom";

interface IInstitutionUpdateForm {
  institutions: IInstitution[];
  selected: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const ChangeInstitutionForm: FC<IInstitutionUpdateForm> = ({
  institutions,
  selected,
  setIsOpen,
}) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangeInstitution>({
    resolver: zodResolver(changeInstitutionSchema),
    defaultValues: {
      institutionId: selected,
    },
  });

  const navigate = useNavigate();
  const changeInstitutionMutation = useMutation(changeInstitution);

  const onSubmit = (data: ChangeInstitution) => {
    if (data.institutionId != selected) {
      changeInstitutionMutation.mutate(data, {
        onSuccess() {
          toast.success("Institution created successfully");
          setIsOpen(false);
          queryClient.invalidateQueries(USER_PROFILE);
          navigate("/", { replace: true });
        },
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='flex gap-4 flex-col'>
        <div className='block'>
          <OptionsField
            label='Type'
            register={register("institutionId")}
            error={errors.institutionId?.message}
            required={true}
            defaultLabel='Select type'
            options={institutions?.map((institution) => ({
              value: institution.id,
              label: `${institution.name} ${
                institution.parentInstitution
                  ? ` (${institution.parentInstitution.name})`
                  : ""
              }`,
            }))}
          />
        </div>

        <div className='py-4 mx-auto flex items-center justify-end md:justify-start md:flex-start space-x-2'>
          <Button
            isLoading={changeInstitutionMutation.isLoading}
            label={"Change Institution"}
          />
        </div>
      </form>
    </>
  );
};

export default ChangeInstitutionForm;
