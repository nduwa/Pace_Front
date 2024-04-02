import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import Button from "../common/form/Button";
import TextField from "../common/form/TextField";

import { createUser, updateUserProfile } from "../../apis/users";

import { ICreateUser, createUserSchema } from "../../utils/schemas/users.schema";
import { ALL_USERS } from "../../utils/constants/queryKeys";
import { IUserProfile } from "../../types/common";

import toast from "react-hot-toast";

interface IAddUserFormProps {
  user?: IUserProfile;
  closeModal: () => void;
}

const AddUserForm: FC<IAddUserFormProps> = ({ user, closeModal }) => {
  const createUserMutation = useMutation(createUser);
  const updateUserMutation = useMutation(updateUserProfile);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ICreateUser>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { ...user },
  });

  useEffect(() => {
    if (user) {
      for (const [key, value] of Object.entries(user)) {
        setValue(key as keyof ICreateUser, value);
      }
    }
  }, [user, setValue]);

  const onSubmit = async (data: ICreateUser) => {
    if (user && user.id) {
      await updateUserMutation.mutateAsync(
        { ...data, id: user.id },
        {
          onSuccess() {
            toast.success(`User Updated`);
            queryClient.invalidateQueries(ALL_USERS);
            closeModal();
          },
        },
      );
    } else {
      await createUserMutation.mutateAsync(data, {
        onSuccess() {
          reset();
          toast.success(`User Added`);
          queryClient.invalidateQueries(ALL_USERS);
          closeModal();
        },
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
        <div className='grid grid-cols-1'>
          <TextField
            error={errors.name?.message}
            register={register("name")}
            label='User name'
            type='text'
          />
        </div>
        <div className='grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-4'>
          <TextField
            error={errors.email?.message}
            register={register("email")}
            label='Email'
            type='email'
          />
          <TextField
            error={errors.phone?.message}
            register={register("phone")}
            label='Phone'
            type='tel'
          />
        </div>

        <div className='flex justify-start'>
          <Button
            isLoading={createUserMutation.isLoading}
            label={user ? `Update User` : `Add User`}
            className='bg-darkblue hover:bg-darkblue w-1/4 mt-4'
          />
        </div>
      </form>
    </>
  );
};

export default AddUserForm;
