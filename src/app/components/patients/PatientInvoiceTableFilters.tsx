import { useQuery } from "@tanstack/react-query";
import Button from "../common/form/Button";
import OptionsField from "../common/form/OptionsField";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { IPatientInvoiceFilter } from "../../types/filters";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientInvoiceFilterSchema } from "../../utils/schemas/tableFilters.schemas";
import { INSTITUTIONS_NPAGED } from "../../utils/constants/queryKeys";
import { isValidDateRange } from "../../constants/helperFunctions";
import TextField from "../common/form/TextField";
import { getinstitutions } from "../../apis/institution";

interface IPatientInvoiceTableFiltersProps {
  filterFunc: (filters: string) => void;
  defaultValues?: IPatientInvoiceFilter;
  isLoading?: boolean;
  closeDrawer?: () => void;
}

const PatientInvoiceTableFilters: FC<IPatientInvoiceTableFiltersProps> = ({
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
  } = useForm<IPatientInvoiceFilter>({
    resolver: zodResolver(patientInvoiceFilterSchema),
  });
  const handleFilter = (data: IPatientInvoiceFilter) => {
    const ValidResult = patientInvoiceFilterSchema.safeParse(data);
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

  const { data: institutions } = useQuery({
    queryFn: getinstitutions,
    queryKey: INSTITUTIONS_NPAGED,
  });

  const startDateChaged = (value: string) => {
    setValue("startDate", value);
  };

  const endDateChaged = (value: string) => {
    setValue("endDate", value);
  };

  console.log(institutions);

  return (
    <div className='w-full flex flex-col gap-4'>
      <form onSubmit={handleSubmit(handleFilter)}>
        {institutions && (
          <OptionsField
            required
            error={errors.institution?.message}
            label='Served by'
            register={register("institution")}
            defaultValue={defaultValues?.institution}
            setValue={(value) => setValue("institution", value)}
            options={[
              { label: "All", value: "all", selected: true },
              ...institutions.map((institution) => ({
                label: `${institution.name} ${
                  institution.parentInstitution
                    ? ` (${institution.parentInstitution.name})`
                    : ""
                }`,
                value: institution.id,
              })),
            ]}
          />
        )}

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

export default PatientInvoiceTableFilters;
