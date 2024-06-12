import { useQuery } from "@tanstack/react-query";
import Button from "../common/form/Button";
import OptionsField from "../common/form/OptionsField";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { IFormFilter } from "../../types/filters";
import { zodResolver } from "@hookform/resolvers/zod";
import { formFilterSchema } from "../../utils/schemas/tableFilters.schemas";
import { FORMS_LOCATIONS } from "../../utils/constants/queryKeys";
import { getLocations } from "../../apis/forms";

interface IFormTableFiltersProps {
  filterFunc: (filters: string) => void;
  defaultValues?: IFormFilter;
  isLoading?: boolean;
  closeDrawer?: () => void;
}

const FormTableFilters: FC<IFormTableFiltersProps> = ({
  filterFunc,
  defaultValues,
  isLoading,
  closeDrawer,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IFormFilter>({
    resolver: zodResolver(formFilterSchema),
  });
  const handleFilter = (data: IFormFilter) => {
    const filters = Object.entries(data)
      .map((entrie) => `${entrie[0]}=${entrie[1]}`)
      .join("&");
    filterFunc(filters);
    closeDrawer && closeDrawer();
  };

  const { data: locations } = useQuery({
    queryFn: getLocations,
    queryKey: FORMS_LOCATIONS,
  });

  const isOpen = ["Yes", "No"];

  return (
    <div className='w-full flex flex-col gap-4'>
      <form onSubmit={handleSubmit(handleFilter)}>
        <OptionsField
          required
          error={errors.at?.message}
          label='Form at'
          register={register("at")}
          defaultValue={defaultValues?.at}
          setValue={(value) => setValue("at", value)}
          options={
            locations
              ? [
                  { label: "All", value: "all", selected: true },
                  ...locations.map((location) => ({
                    label: location,
                    value: location,
                  })),
                ]
              : []
          }
        />

        <OptionsField
          required
          error={errors.isOpen?.message}
          register={register("isOpen")}
          defaultValue={defaultValues?.isOpen}
          setValue={(value) => setValue("isOpen", value)}
          label='Is Form Open'
          options={[
            { label: "All", value: "all", selected: true },
            ...isOpen.map((value) => ({
              label: value,
              value: value.toLowerCase(),
            })),
          ]}
        />

        <div className='flex mt-5'>
          <Button isLoading={isLoading} className='w-full' label='Apply' />
        </div>
      </form>
    </div>
  );
};

export default FormTableFilters;
