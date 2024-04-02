import z, { ZodType } from "zod";
import {
  IJobcardTableFilters,
  ILeaveBalanceFilters,
  IRequisitionTableFilters,
  IUserTableFilters,
  IVehicleTableFilters,
} from "../../types/filters";

export const leaveBalanceFiltersShema: ZodType<ILeaveBalanceFilters> = z.object({
  department: z.string().nonempty({ message: "Select a department" }),
});

export const usersFiltersShema: ZodType<IUserTableFilters> = z.object({
  department: z.string().nonempty({ message: "Select a department" }),
  role: z.string().nonempty({ message: "Select a role" }),
  gender: z.string().nonempty({ message: "Select gender" }),
});

export const jobcardFiltersShema: ZodType<IJobcardTableFilters> = z.object({
  status: z.string(),
  vehicle: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export const requisitionFiltersShema: ZodType<IRequisitionTableFilters> = z.object({
  status: z.string(),
  requester: z.string(),
  stock: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export const vehicleFiltersShema: ZodType<IVehicleTableFilters> = z.object({
  brand: z.string(),
});

export const leaveFiltersSchema = z.object({
  userId: z.string().optional(),
  departmentId: z.string().optional(),
  year: z.string().optional(),
  leaveType: z.string().optional(),
  status: z.string().optional(),
  type: z.string(),
});
