import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, FC, SetStateAction } from "react";
import toast from "react-hot-toast";
import TextField from "../common/form/TextField";
import Button from "../common/form/Button";
import { IExam, IExamRequest } from "../../types/exams";
import { examSchema } from "../../utils/schemas/exams.schema";
import { createExam, updateExam } from "../../apis/exams";
import { EXAMS } from "../../utils/constants/queryKeys";
import TextArea from "../common/form/TextArea";

interface IExamForm {
  exam?: IExam;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const ExamForm: FC<IExamForm> = ({ exam, setIsOpen }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IExamRequest>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      ...exam,
    },
  });

  const createExamMutation = useMutation(createExam);
  const updateExamMutation = useMutation(updateExam);

  const onSubmit = (data: IExamRequest) => {
    if (exam && exam.id) {
      updateExamMutation.mutate({ id: exam.id, ...data } as IExam, {
        onSuccess() {
          toast.success("Exam updated successfully");
          setIsOpen(false);
          queryClient.invalidateQueries(EXAMS);
          reset();
        },
      });
    } else {
      createExamMutation.mutate(data, {
        onSuccess() {
          toast.success("Exam created successfully");
          setIsOpen(false);
          queryClient.invalidateQueries(EXAMS);
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
            error={errors.name?.message}
            register={register("name")}
          />
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <TextField
            label='Code'
            type='text'
            error={errors.exam_code?.message}
            register={register("exam_code")}
          />
          <TextField
            label='Price'
            type='number'
            allowFloats={true}
            error={errors.price?.message}
            register={register("price")}
          />
        </div>

        <div className='grid'>
          <TextArea
            label='Description'
            error={errors.description?.message}
            register={register("description")}
            rows={2}
          />
        </div>
        <div className='grid'></div>
        <div className='py-4 mx-auto flex items-center justify-end md:justify-start md:flex-start space-x-2'>
          <Button
            isLoading={
              exam && exam.id
                ? updateExamMutation.isLoading
                : createExamMutation.isLoading
            }
            label={exam && exam.id ? "Update Exam" : "Create Exam"}
          />
        </div>
      </form>
    </>
  );
};

export default ExamForm;
