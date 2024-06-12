import Button from "../common/form/Button";
import OptionsField from "../common/form/OptionsField";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { ITransactionFilter } from "../../types/filters";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionFilterSchema } from "../../utils/schemas/tableFilters.schemas";
import { isValidDateRange } from "../../constants/helperFunctions";
import TextField from "../common/form/TextField";

interface ITransactionTableFiltersProps {
  filterFunc: (filters: string) => void;
  defaultValues?: ITransactionFilter;
  isLoading?: boolean;
  closeDrawer?: () => void;
}

const TransactionTableFilters: FC<ITransactionTableFiltersProps> = ({
  filterFunc,
  defaultValues,
  isLoading,
  closeDrawer,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<ITransactionFilter>({
    resolver: zodResolver(transactionFilterSchema),
  });
  const handleFilter = (data: ITransactionFilter) => {
    const ValidResult = transactionFilterSchema.safeParse(data);
    if (ValidResult.success) {
      if (isValidDateRange(data.startDate, data.endDate) === false) {
        setError("startDate", {
          type: "manual",
          message: "Invalid range",
        });
      } else {
        const filters = Object.entries(data)
          .map((entrie) => `${entrie[0]}=${entrie[1]}`)
          .join("&");
        filterFunc(filters);
        closeDrawer && closeDrawer();
      }
    }
  };

  const startDateChaged = (value: string) => {
    setValue("startDate", value);
  };

  const endDateChaged = (value: string) => {
    setValue("endDate", value);
  };

  return (
    <div className='w-full flex flex-col gap-4'>
      <form onSubmit={handleSubmit(handleFilter)}>
        <OptionsField
          required
          error={errors.type?.message}
          label='Served by'
          register={register("type")}
          defaultValue={defaultValues?.type}
          setValue={(value) => setValue("type", value)}
          options={[
            { label: "All", value: "all", selected: true },
            { label: "INCOME", value: "INCOME" },
            { label: "EXPENSE", value: "EXPENSE" },
          ]}
        />

        <div className='mt-2'>
          <div className='flex space-x-2'>
            <TextField
              label='Start date'
              type='date'
              error={errors.startDate?.message}
              register={register("startDate")}
              onValueChage={startDateChaged}
            />
            <TextField
              label='End date'
              type='date'
              error={errors.endDate?.message}
              register={register("endDate")}
              onValueChage={endDateChaged}
            />
          </div>
        </div>

        <div className='flex mt-5'>
          <Button isLoading={isLoading} className='w-full' label='Apply' />
        </div>
      </form>
    </div>
  );
};

export default TransactionTableFilters;
