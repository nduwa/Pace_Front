import { z } from "zod";

export const drugSchema = z.object({
  drug_code: z.string().min(1, "Drug code is required"),
  description: z.string().min(1, "Description is required"),
  designation: z.string().min(1, "Designation is required"),
  instruction: z.string(),
  drugCategory: z.string().min(1, "Selling unit is required"),
});

// const isUniqueDrugStock = (drugs: Array<{ drug: string }>) => {
//   const drugSet = new Set<string>();
//   for (const { drug } of drugs) {
//     if (drugSet.has(drug)) {
//       return false;
//     }
//     drugSet.add(drug);
//   }
//   return true;
// };

export const createPurchaseSchema = z.object({
  note: z.string().optional(),
  date: z.string().min(10, "Valid date is required"),
  supplier: z.string().optional(),
  drugs: z
    .array(
      z.object({
        drug: z
          .string({ required_error: "select Drug" })
          .min(4, { message: "invalid Drug" }),
        qty: z
          .string({ required_error: "Quantity is required " })
          .transform((value) => {
            const num = parseInt(value);
            return num;
          }),
        unitPrice: z
          .string({ required_error: "Unit price is required" })
          .transform((value) => {
            const num = parseInt(value);
            return num;
          }),
        sellingPrice: z
          .string({ required_error: "Unit price is required" })
          .transform((value) => {
            const num = parseInt(value);
            return num;
          }),
        batchNumber: z.string().optional(),
        expireDate: z.string(),
      }),
    )
    .min(1),
});

export const purchaseDrugsSchema = z.object({
  drugs: z.array(
    z.object({
      id: z.string(),
      batchNumber: z.string().optional(),
      expireDate: z.string().optional(),
    }),
  ),
});

export type IPurchaseDrugs = z.infer<typeof purchaseDrugsSchema>;

export const drugCategorySchema = z.object({
  name: z.string().min(1, "Required"),
});
