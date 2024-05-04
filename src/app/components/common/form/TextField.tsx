import { FC } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface ITextField {
  label?: string;
  type: string;
  register?: UseFormRegisterReturn;
  error?: string;
  value?: string;
  margin?: boolean;
  allowFloats?: boolean;
  disabled?: boolean;
  onValueChage?: (value: string) => void;
  additionalClass?: string;
  name?: string;
}
const TextField: FC<ITextField> = ({
  label,
  type,
  register,
  error,
  value = "",
  disabled = false,
  margin = true,
  allowFloats = true,
  onValueChage,
  additionalClass = "",
  ...props
}) => {
  return (
    <div className='block w-full'>
      {label && (
        <label className='block text-sm font-medium leading-6 text-gray-900'>
          {label}
        </label>
      )}
      <div className={`${margin ? "mt-2" : ""} w-full`}>
        <input
          {...register}
          {...props}
          type={type}
          defaultValue={value}
          onChange={(e) => onValueChage && onValueChage(e.target.value)}
          className={`${additionalClass} block w-full rounded-md border-0 py-2 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-1 focus:ring-inset ${
            error
              ? `focus:ring-red-500 ring-red-300 placeholder:text-red-400`
              : `focus:ring-green ring-gray-300 placeholder:text-gray-400`
          }  sm:text-sm sm:leading-6 outline-none`}
          {...(disabled ? { disabled: true } : {})}
          {...(allowFloats ? { step: 0.01 } : {})}
        />
        <label className='block text-sm leading-6 text-red-500'>{error}</label>
      </div>
    </div>
  );
};
export default TextField;
