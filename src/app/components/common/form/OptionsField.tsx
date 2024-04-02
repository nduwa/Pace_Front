import { FC, useEffect } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
interface IOptionFielOption {
  value: string;
  label: string;
  disabled?: boolean;
  selected?: boolean;
}
interface IOptionsField {
  label?: string;
  register?: UseFormRegisterReturn;
  error?: string;
  options?: IOptionFielOption[];
  defaultValue?: string;
  margin?: boolean;
  required?: boolean;
  defaultLabel?: string;
  onChange?: (value: string) => void;
  onValueChage?: (value: string) => void;
  setValue?: (params: string) => void;
}
const OptionsField: FC<IOptionsField> = ({
  label,
  options,
  register,
  error,
  defaultValue,
  required = true,
  margin = true,
  defaultLabel,
  setValue,
  onChange,
  onValueChage,
}) => {
  useEffect(() => {
    if (defaultValue?.trim()) {
      setValue && setValue(defaultValue);
    }
  }, [defaultValue, setValue]);
  return (
    <div>
      {label && (
        <label className='block text-sm font-medium leading-6 text-gray-900'>
          {label}
        </label>
      )}
      <div className={`${margin ? "mt-2" : ""} w-full`}>
        <select
          {...register}
          onChange={(e) => {
            onValueChage && onValueChage(e.target.value);
            onChange && onChange(e.target.value);
          }}
          defaultValue={defaultValue}
          className={`block w-full rounded-md bg-white border-0 py-2 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-1 focus:ring-inset ${
            error
              ? `focus:ring-red-500 ring-red-300 placeholder:text-red-400`
              : `focus:ring-darkblue ring-gray-300 placeholder:text-gray-400`
          }  sm:text-sm sm:leading-6 outline-none`}
        >
          {!required && (
            <option value={""}>{defaultLabel ? defaultLabel : "Select one"}</option>
          )}
          {options?.map((option) => (
            <option
              disabled={option.disabled}
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
        <label className='block text-sm leading-6 text-red-500'>{error}</label>
      </div>
    </div>
  );
};
export default OptionsField;
