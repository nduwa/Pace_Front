import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, FC, SetStateAction } from "react";
import toast from "react-hot-toast";
import TextField from "../common/form/TextField";
import Button from "../common/form/Button";
import { CONSULTATIONS } from "../../utils/constants/queryKeys";
import { IConsultation, IConsultationRequest } from "../../types/common";
import { consultationSchema } from "../../utils/schemas/consultation.schema";
import { createConsultation, updateConsultation } from "../../apis/consultation";

interface IConsultationForm {
  consultation?: IConsultation;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const ConsultationForm: FC<IConsultationForm> = ({ consultation, setIsOpen }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IConsultationRequest>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      ...consultation,
    },
  });

  const createConsultationMutation = useMutation(createConsultation);
  const updateConsultationMutation = useMutation(updateConsultation);

  const onSubmit = (data: IConsultationRequest) => {
    if (consultation && consultation.id) {
      updateConsultationMutation.mutate(
        { id: consultation.id, ...data } as IConsultation,
        {
          onSuccess() {
            toast.success("Consultation updated successfully");
            setIsOpen(false);
            queryClient.invalidateQueries(CONSULTATIONS);
            reset();
          },
        },
      );
    } else {
      createConsultationMutation.mutate(data, {
        onSuccess() {
          toast.success("Consultation created successfully");
          setIsOpen(false);
          queryClient.invalidateQueries(CONSULTATIONS);
          reset();
        },
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='flex gap-4 flex-col'>
        <div className='block'>
          <TextField
            label='Name'
            type='text'
            error={errors.label?.message}
            register={register("label")}
          />
        </div>
        <div className='grid'>
          <TextField
            label='Price'
            type='number'
            allowFloats={true}
            error={errors.price?.message}
            register={register("price")}
          />
        </div>

        <div className='grid'></div>
        <div className='py-4 mx-auto flex items-center justify-end md:justify-start md:flex-start space-x-2'>
          <Button
            isLoading={
              consultation && consultation.id
                ? updateConsultationMutation.isLoading
                : createConsultationMutation.isLoading
            }
            label={
              consultation && consultation.id
                ? "Update Consultation"
                : "Create Consultation"
            }
          />
        </div>
      </form>
    </>
  );
};

export default ConsultationForm;
