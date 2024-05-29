import { useQuery } from "@tanstack/react-query";
import Button from "../common/form/Button";
import OptionsField from "../common/form/OptionsField";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { IInvoiceFilter } from "../../types/filters";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceFilterSchema } from "../../utils/schemas/tableFilters.schemas";
import { USERS_NPAGED } from "../../utils/constants/queryKeys";
import { getAllUsersNPaged } from "../../apis/users";
import { isValidDateRange } from "../../constants/helperFunctions";
import TextField from "../common/form/TextField";

interface IInvoiceTableFiltersProps {
  filterFunc: (filters: string) => void;
  defaultValues?: IInvoiceFilter;
  isLoading?: boolean;
  closeDrawer?: () => void;
}

const InvoiceTableFilters: FC<IInvoiceTableFiltersProps> = ({
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
  } = useForm<IInvoiceFilter>({
    resolver: zodResolver(invoiceFilterSchema),
  });
  const handleFilter = (data: IInvoiceFilter) => {
    const ValidResult = invoiceFilterSchema.safeParse(data);
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

  const { data: users } = useQuery({
    queryFn: getAllUsersNPaged,
    queryKey: USERS_NPAGED,
  });

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
          error={errors.requester?.message}
          label='Served by'
          register={register("requester")}
          defaultValue={defaultValues?.requester}
          setValue={(value) => setValue("requester", value)}
          options={
            users
              ? [
                  { label: "All", value: "all", selected: true },
                  ...users.map((requester) => ({
                    label: requester.name,
                    value: requester.id,
                  })),
                ]
              : []
          }
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

export default InvoiceTableFilters;
