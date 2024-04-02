import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IResetPasswordRequest } from "../../types/auth";
import { ForgotPasswordSchema } from "../../utils/schemas/auth.schema";
import { useMutation } from "@tanstack/react-query";
import Button from "../../components/common/form/Button";
import TextField from "../common/form/TextField";
import { resetPasswordRequest } from "../../apis/auth";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IResetPasswordRequest>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const [isModalOpen, setModalOpen] = useState(false);
  const forgotPasswordMutation = useMutation(resetPasswordRequest);

  const submitForgotPasswordData = async (data: IResetPasswordRequest) => {
    await forgotPasswordMutation.mutateAsync(data, {
      onSuccess: () => {
        toast.success("Password reset link sent successfully!");
        setModalOpen(true);
      },
    });
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
                      Password reset link sent successfully!
                    </h3>
                    <div className='mt-2'>
                      <p className='text-sm text-gray-500'>
                        Please check your email for the password reset link. If you
                        don't see it, please check your spam folder.
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
                    Go back to home
                  </button>
                </div>
              </div>
            ) : (
              <div className='w-full '>
                <div>
                  <h2 className='mt-6 text-2xl font-bold text-center tracking-tight text-gray-900'>
                    Recover Your Password
                  </h2>
                  <p className='mt-2 text-sm text-center text-gray-600 max-w'>
                    Enter your email address below and we will send you a link to
                    reset your password.
                  </p>
                </div>

                <div className='mt-8'>
                  <div className='mt-6'>
                    <form
                      onSubmit={handleSubmit(submitForgotPasswordData)}
                      className='space-y-6 w-full'
                    >
                      <div className='w-full'>
                        <TextField
                          label='Email address'
                          type='email'
                          error={errors.email?.message}
                          register={register("email")}
                        />
                      </div>

                      <div className='w-full'>
                        <Button
                          label={
                            forgotPasswordMutation.isLoading
                              ? "Loading..."
                              : "Send Reset Link"
                          }
                          isLoading={forgotPasswordMutation.isLoading}
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
          <span className='sr-only'> Password Reset Link Sent</span>
        ) : (
          <div className='relative pb-8 lg:pb-12 pt-12 flex justify-center text-sm'>
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
