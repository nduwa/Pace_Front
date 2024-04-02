import { FC } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface ITextArea {
  label: string;
  register?: UseFormRegisterReturn;
  error?: string;
  value?: string;
  disabled?: boolean;
  onValueChage?: (value: string) => void;
}
const TextArea: FC<ITextArea> = ({
  label,
  register,
  error,
  value = "",
  disabled = false,
  onValueChage,
}) => {
  return (
    <div className='block min-w-full'>
      <label className='block text-sm font-medium leading-6 text-gray-900'>
        {label}
      </label>
      <div className='mt-2 min-w-full'>
        <textarea
          rows={5}
          {...register}
          defaultValue={value}
          onChange={(e) => onValueChage && onValueChage(e.target.value)}
          className={`block min-w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-1 focus:ring-inset ${
            error
              ? `focus:ring-red-500 ring-red-300 placeholder:text-red-400`
              : `focus:ring-darkblue ring-gray-300 placeholder:text-gray-400`
          }  sm:text-sm sm:leading-6 outline-none`}
          {...(disabled ? { disabled: true } : {})}
        />
        <label className='block text-sm leading-6 text-red-500'>{error}</label>
      </div>
    </div>
  );
};
export default TextArea;
