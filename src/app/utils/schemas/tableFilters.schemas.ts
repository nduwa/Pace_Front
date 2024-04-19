import z, { ZodType } from "zod";
import { IDrugFilter } from "../../types/filters";

export const drugFilterSchema: ZodType<IDrugFilter> = z.object({
  isOnMarket: z.string(),
  drugCategory: z.string(),
});
