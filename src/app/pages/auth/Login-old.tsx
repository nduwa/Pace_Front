import image from "../../assets/images/homepage.png";
import logo from "../../assets/images/logo PNG.png";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ILoginFormData } from "../../types/auth";
import { LoginSchema } from "../../utils/schemas/auth.schema";
import { useMutation } from "@tanstack/react-query";
import TextField from "../../components/common/form/TextField";
import PasswordField from "../../components/common/form/PasswordField";
import Button from "../../components/common/form/Button";
import { login } from "../../apis/auth";
import { useSignIn } from "react-auth-kit";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const signIn = useSignIn();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginFormData>({
    resolver: zodResolver(LoginSchema),
  });
  const loginMutation = useMutation(login);
  const currentYear = new Date().getFullYear();

  const submitLoginData = async (data: ILoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess(response) {
        const { accessToken, ...authState } = response;
        signIn({
          token: accessToken,
          expiresIn: 60,
          authState: authState,
          tokenType: "Bearer",
        });
        navigate("/");
      },
      onError() {
        toast.error("Invalid credentials!");
      },
    });
  };

  return (
    <>
      <main className='min-w-full min-h-full'>
        <div className='flex w-full justify-center  gap-5 p-6 md:p-16 lg:p-16 '>
          <div className='flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
            <div className='mx-auto w-full h-full max-w-md lg:w-[500px]'>
              <div>
                <img src={logo} className='h-30 w-30' alt='RITCO Logo' />

                <h2 className='mt-6 text-3xl font-bold tracking-tight text-gray-900'>
                  Sign in to your account
                </h2>
              </div>

              <div className='mt-8'>
                <div className='mt-6'>
                  <form
                    onSubmit={handleSubmit(submitLoginData)}
                    className='space-y-6'
                  >
                    <div>
                      <TextField
                        error={errors.email?.message}
                        type='email'
                        label='Email'
                        register={register("email")}
                      />
                    </div>

                    <div className='space-y-1'>
                      <PasswordField
                        label='Password'
                        error={errors.password?.message}
                        {...register("password")}
                      />
                    </div>

                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <input
                          id='remember-me'
                          name='remember-me'
                          type='checkbox'
                          className='h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500'
                        />
                        <label
                          htmlFor='remember-me'
                          className='ml-2 block text-sm text-gray-900'
                        >
                          Remember me
                        </label>
                      </div>

                      <div className='text-sm'>
                        <Link
                          to='/forgot-password'
                          className='font-medium text-gray-600 hover:text-gray-500'
                        >
                          Forgot your password?
                        </Link>
                      </div>
                    </div>

                    <div>
                      <Button
                        label='Sign In'
                        isLoading={loginMutation.isLoading}
                        className='hover:bg-darkblue  focus:ring-darkblue bg-darkblue w-full'
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className='relative hidden flex-1 lg:block'>
            <img
              className=' absolute inset-0 w-full h-full'
              src={image}
              alt='Home Image'
            />
          </div>
        </div>
        <div className='fixed bottom-0 bg-gray-800 min-w-full'>
          <p className='text-gray-200 text-center font-medium p-4 md:p-8'>
            &copy; {currentYear} RITCO Ltd. All rights reserved. Developed by ETITE
            Ltd
          </p>
        </div>
      </main>
    </>
  );
};

export default Login;
