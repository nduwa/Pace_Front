import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IResetPassword } from "../../types/auth";
import { ResetPasswordSchema } from "../../utils/schemas/auth.schema";
import { useMutation } from "@tanstack/react-query";
import PasswordField from "../common/form/PasswordField";
import { resetPassword } from "../../apis/auth";
import { CheckIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../common/form/Button";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IResetPassword>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const [isModalOpen, setModalOpen] = useState(false);
  const resetPasswordMutation = useMutation(resetPassword);

  const submitResetPasswordData = async (data: IResetPassword) => {
    console.log("submitResetPasswordData called with data:", data);
    const payload = {
      token,
      password: data.password,
      confirmPassword: data.confirmPassword,
    };
    if (data.password !== data.confirmPassword) {
      toast.error("Password and Confirm Password do not match!");
      return;
    }
    await resetPasswordMutation.mutateAsync(payload);
    toast.success("Password reset successful!");
    setModalOpen(true);
  };

  return (
    <>
      <div className='flex flex-col w-full max-w-full'>
        <div className='flex w-full justify-center gap-5'>
          <div className='flex flex-1 flex-col justify-center'>
            {isModalOpen ? (
              <div className='relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6'>
                <div>
                  <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-lime-200'>
                    <CheckIcon
                      className='h-6 w-6 text-darkblue'
                      aria-hidden='true'
                    />
                  </div>
                  <div className='mt-3 text-center sm:mt-5'>
                    <h3 className='text-lg font-medium leading-6 text-gray-900'>
                      Password reset successfully!
                    </h3>
                    <div className='mt-2'>
                      <p className='text-sm text-gray-500'>
                        Please go back to login page and login with your new
                        password.
                      </p>
                    </div>
                  </div>
                </div>
                <div className='mt-5 sm:mt-6'>
                  <button
                    type='button'
                    className='inline-flex w-full justify-center rounded-md border border-transparent hover:bg-darkblue bg-darkblue px-4 py-2 text-base font-medium text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-lime-700 focus:ring-offset-2 sm:text-sm'
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Go back to Login
                  </button>
                </div>
              </div>
            ) : (
              <div className='w-full'>
                <div>
                  <LockClosedIcon className='mx-auto h-24 w-auto bg-gray-200 border rounded-full  text-[#cc8B09]' />
                  <h2 className='mt-6 text-2xl font-bold text-center tracking-tight text-gray-900'>
                    Reset Your Password
                  </h2>
                  <p className='mt-2 text-sm text-center text-gray-600 max-w'>
                    Enter your new password below. And confirm it.
                  </p>
                </div>

                <div className='mt-8'>
                  <div className='mt-6'>
                    <form
                      onSubmit={handleSubmit(submitResetPasswordData)}
                      className='space-y-6'
                    >
                      <div>
                        <PasswordField
                          label='New Password'
                          id='password'
                          error={errors.password?.message}
                          {...register("password")}
                          disabled={resetPasswordMutation.isLoading}
                        />
                      </div>

                      <div>
                        <PasswordField
                          label='Confirm Password'
                          id='confirmPassword'
                          error={errors.confirmPassword?.message}
                          {...register("confirmPassword")}
                          disabled={resetPasswordMutation.isLoading}
                        />
                      </div>

                      <div>
                        <Button
                          label={
                            resetPasswordMutation.isLoading
                              ? "Loading..."
                              : "Reset Password"
                          }
                          isLoading={resetPasswordMutation.isLoading}
                          className='hover:bg-darkblue  focus:ring-darkblue bg-darkblue w-full rounded-lg'
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {isModalOpen ? (
          <span className='sr-only'> Password Reset Successful</span>
        ) : (
          <div className='relative pb-8 lg:pb-12 flex justify-center text-sm'>
            <span className='px-2 bg-white text-gray-500'>
              Or{" "}
              <Link
                to='/login'
                className='font-medium text-darkblue hover:text-gray-500'
              >
                Go back to login
              </Link>
            </span>
          </div>
        )}
      </div>
    </>
  );
}
