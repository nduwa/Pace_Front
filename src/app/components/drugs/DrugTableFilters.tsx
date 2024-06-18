import { useQuery } from "@tanstack/react-query";
import Button from "../common/form/Button";
import OptionsField from "../common/form/OptionsField";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { IDrugFilter } from "../../types/filters";
import { zodResolver } from "@hookform/resolvers/zod";
import { drugFilterSchema } from "../../utils/schemas/tableFilters.schemas";
import { DRUGS_CATEGORIES } from "../../utils/constants/queryKeys";
import { getdrugCategoriesNPaged } from "../../apis/drug";

interface IDrugTableFiltersProps {
  filterFunc: (filters: string) => void;
  defaultValues?: IDrugFilter;
  isLoading?: boolean;
  closeDrawer?: () => void;
}

const DrugTableFilters: FC<IDrugTableFiltersProps> = ({
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
  } = useForm<IDrugFilter>({
    resolver: zodResolver(drugFilterSchema),
  });
  const handleFilter = (data: IDrugFilter) => {
    const filters = Object.entries(data)
      .map((entrie) => `${entrie[0]}=${entrie[1]}`)
      .join("&");
    filterFunc(filters);
    closeDrawer && closeDrawer();
  };

  const { data: drugCategorys } = useQuery({
    queryFn: getdrugCategoriesNPaged,
    queryKey: DRUGS_CATEGORIES,
  });
  const isOnMarket = ["Yes", "No"];

  return (
    <div className='w-full flex flex-col gap-4'>
      <form onSubmit={handleSubmit(handleFilter)}>
        <OptionsField
          required
          error={errors.drugCategory?.message}
          label='User drugCategory'
          register={register("drugCategory")}
          defaultValue={defaultValues?.drugCategory}
          setValue={(value) => setValue("drugCategory", value)}
          options={
            drugCategorys
              ? [
                  { label: "All", value: "all", selected: true },
                  ...drugCategorys.map((drugCategory) => ({
                    label: drugCategory.name,
                    value: drugCategory.name,
                  })),
                ]
              : []
          }
        />
        <OptionsField
          required
          error={errors.isOnMarket?.message}
          register={register("isOnMarket")}
          defaultValue={defaultValues?.isOnMarket}
          setValue={(value) => setValue("isOnMarket", value)}
          label='Drug isOnMarket'
          options={[
            { label: "All", value: "all", selected: true },
            ...isOnMarket.map((value) => ({
              label: value,
              value: value,
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

export default DrugTableFilters;
