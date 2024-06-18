import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, FC, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import { FORM, FORMS, FORMS_LOCATIONS } from "../../utils/constants/queryKeys";
import OptionsField from "../common/form/OptionsField";
import Button from "../common/form/Button";
import { getLocations, sendForm } from "../../apis/forms";
import { IForm, sendFormRequest } from "../../types/forms";
import { sendFromSchema } from "../../utils/schemas/forms.schema";
import Modal from "../common/Modal";
import { DocumentArrowUpIcon } from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";

interface props {
  form: IForm;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  reload?: boolean;
}

const SendFormModal: FC<props> = ({ form, setIsOpen, reload = false }) => {
  const location = useLocation();
  const navigation = useNavigate();
  const { data: locations } = useQuery({
    queryFn: getLocations,
    queryKey: FORMS_LOCATIONS,
  });

  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<sendFormRequest>({
    resolver: zodResolver(sendFromSchema),
    defaultValues: {
      id: form.id,
      to: form.at,
    },
  });

  const sendFormMutation = useMutation(sendForm);

  const onSubmit = (data: sendFormRequest) => {
    if (data.to != form.at) {
      sendFormMutation.mutate(
        { ...data, id: form.id },
        {
          onSuccess() {
            toast.success("Form sent successfully");
            queryClient.invalidateQueries(FORMS);
            queryClient.invalidateQueries(FORM);
            setIsOpen && !reload && setIsOpen(false);
            reload && navigation(location.pathname, { replace: true });
          },
        },
      );
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='flex gap-4 flex-col'>
        <div className='block'>
          <OptionsField
            label='Type'
            register={register("to")}
            error={errors.to?.message}
            required={true}
            defaultLabel='Select location'
            options={locations?.map((location) => ({
              value: location,
              label: location,
            }))}
          />
        </div>

        <div className='py-4 mx-auto flex items-center justify-end md:justify-start md:flex-start space-x-2'>
          <Button isLoading={sendFormMutation.isLoading} label={"Send Form"} />
        </div>
      </form>
    </>
  );
};

const SendForm: FC<props> = ({ form, reload = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className='
    flex justify-center cursor-pointer rounded-md border border-transparent  py-2 px-4 text-sm font-medium shadow-sm focus:ring-2 bg-white text-darkblue focus:outline-none  outline-none transition-colors duration-300 p-.5 bg-white text-darkblue'
      >
        <DocumentArrowUpIcon className='w-5' />
        <span>Send</span>
      </div>

      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={`Send ${form.formNO}`}
        >
          <SendFormModal form={form} setIsOpen={setIsOpen} reload={reload} />
        </Modal>
      )}
    </>
  );
};

export default SendForm;
