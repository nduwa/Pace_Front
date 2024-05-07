import { z } from "zod";

const isUniqueDrug = (drugs: Array<{ drug: string }>) => {
  const drugSet = new Set<string>();
  for (const { drug } of drugs) {
    if (drugSet.has(drug)) {
      return false;
    }
    drugSet.add(drug);
  }
  return true;
};

export const createInvoiceSchema = z.object({
  note: z.string().optional(),
  patientId: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  drugs: z
    .array(
      z.object({
        drug: z
          .string({ required_error: "select Drug" })
          .min(4, { message: "invalid Drug" }),
        qty: z.coerce.number().min(0.1),
      }),
    )
    .min(1)
    .refine((data) => isUniqueDrug(data), { message: "Drugs must be unique" }),
});
