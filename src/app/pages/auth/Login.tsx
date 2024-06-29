import { useForm } from "react-hook-form";
import { ILoginFormData } from "../../types/auth";
import { useSignIn } from "react-auth-kit";
import { Link, useNavigate } from "react-router-dom";
import { LoginSchema } from "../../utils/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../apis/auth";
import TextField from "../../components/common/form/TextField";
import PasswordField from "../../components/common/form/PasswordField";
import Button from "../../components/common/form/Button";

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

  const submitLoginData = async (data: ILoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess(response) {
        const { accessToken, ...authState } = response;
        signIn({
          token: accessToken,
          expiresIn: 120,
          authState: authState,
          tokenType: "Bearer",
        });
        navigate("/");
      },
    });
  };
  return (
    <>
      <div className='flex flex-col w-full gap-5 p-6'>
        <div>
          <h2 className='mt-6 text-2xl font-bold text-center tracking-tight text-gray-900'>
            Sign In
          </h2>
          <p className='mt-2 text-sm text-center text-gray-600 max-w'>
            Enter your email address and password below to authenticate
          </p>
        </div>
        <div className='mt-6'>
          <form onSubmit={handleSubmit(submitLoginData)} className='space-y-6'>
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
    </>
  );
};

export default Login;
