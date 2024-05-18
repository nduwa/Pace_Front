import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, FC, SetStateAction } from "react";
import toast from "react-hot-toast";
import { ICreateBranch } from "../../types/common";
import { branchSchema } from "../../utils/schemas/institution.schema";
import { createBranch } from "../../apis/institution";
import { USER_PROFILE } from "../../utils/constants/queryKeys";
import TextField from "../common/form/TextField";
import Button from "../common/form/Button";
import { useNavigate } from "react-router-dom";

interface IInstitutionUpdateForm {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const BranchForm: FC<IInstitutionUpdateForm> = ({ setIsOpen }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreateBranch>({
    resolver: zodResolver(branchSchema),
  });

  const createBranchMutation = useMutation(createBranch);

  const onSubmit = (data: ICreateBranch) => {
    createBranchMutation.mutate(data, {
      onSuccess() {
        toast.success("Branch created!");
        setIsOpen(false);
        queryClient.invalidateQueries(USER_PROFILE);
        navigate("/branches", { replace: true });
      },
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='flex gap-4 flex-col'>
        <div className='block'>
          <TextField
            label='Name'
            type='text'
            error={errors.name?.message}
            register={register("name")}
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <TextField
            label='TIN'
            type='text'
            error={errors.details?.TIN?.message}
            register={register("details.TIN")}
          />
          <TextField
            label='Location'
            type='text'
            error={errors.details?.location?.message}
            register={register("details.location")}
          />
        </div>

        <div className='py-4 mx-auto flex items-center justify-end md:justify-start md:flex-start space-x-2'>
          <Button
            isLoading={createBranchMutation.isLoading}
            label={"Create Branch"}
          />
        </div>
      </form>
    </>
  );
};

export default BranchForm;
