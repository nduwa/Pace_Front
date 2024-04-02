import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../components/common/form/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePassword } from "../../apis/auth";
import { IUpdatePasswordFormData } from "../../types/auth";
import { UpdatePasswordSchema } from "../../utils/schemas/auth.schema";
import toast from "react-hot-toast";
import PasswordField from "../common/form/PasswordField";
import { UPDATE_PASSWORD } from "../../utils/constants/queryKeys";
import { useSignOut } from "react-auth-kit";

interface UpdatePasswordProps {
  onSuccess?: () => void;
}

const UpdatePassword: React.FC<UpdatePasswordProps> = (props) => {
  const queryClient = useQueryClient();
  const signOut = useSignOut();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUpdatePasswordFormData>({
    resolver: zodResolver(UpdatePasswordSchema),
  });
  const updatePasswordMutation = useMutation(updatePassword);

  const submitUpdatePasswordData = async (data: IUpdatePasswordFormData) => {
    await updatePasswordMutation.mutateAsync(data, {
      onSuccess: () => {
        toast.success("Password Updated Successfully!");
        queryClient.invalidateQueries(UPDATE_PASSWORD);
        setTimeout(() => {
          signOut();
          window.location.href = "/login";
          props.onSuccess && props.onSuccess();
        }, 1000);
      },
    });
  };

  return (
    <main className='min-w-full min-h-full'>
      <div className='flex w-full justify-center gap-5 p-4'>
        <div className='flex flex-1 flex-col justify-center px-4 sm:px-2 lg:flex-none lg:px-16 xl:px-20'>
          <div className='mx-auto w-full h-full max-w-md lg:w-[500px]'>
            <h2 className='mt-6 text-3xl font-bold tracking-tight text-gray-900'>
              Update your password
            </h2>

            <div className='mt-8'>
              <form
                onSubmit={handleSubmit(submitUpdatePasswordData)}
                className='space-y-6'
              >
                <PasswordField
                  label='Old Password'
                  id='oldPassword'
                  error={errors.oldPassword?.message}
                  {...register("oldPassword")}
                  disabled={updatePasswordMutation.isLoading}
                />

                <PasswordField
                  label='New Password'
                  id='newPassword'
                  error={errors.newPassword?.message}
                  {...register("newPassword")}
                  disabled={updatePasswordMutation.isLoading}
                />

                <PasswordField
                  label='Confirm Password'
                  id='confirmPassword'
                  error={errors.confirmPassword?.message}
                  {...register("confirmPassword")}
                  disabled={updatePasswordMutation.isLoading}
                />

                <Button
                  label={
                    updatePasswordMutation.isLoading
                      ? "Updating..."
                      : "Update Password"
                  }
                  isLoading={updatePasswordMutation.isLoading}
                  className='hover:bg-darkblue focus:ring-darkblue bg-darkblue w-full'
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UpdatePassword;
