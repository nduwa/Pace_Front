import z, { ZodType } from "zod";
import { IDrugFilter, IInvoiceFilter } from "../../types/filters";

export const drugFilterSchema: ZodType<IDrugFilter> = z.object({
  isOnMarket: z.string(),
  drugCategory: z.string(),
});

export const invoiceFilterSchema: ZodType<IInvoiceFilter> = z.object({
  startDate: z.string(),
  endDate: z.string(),
  requester: z.string(),
});

export const patientInvoiceFilterSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  institution: z.string(),
});

export const formFilterSchema = z.object({
  at: z.string(),
  isOpen: z.string(),
});
