import { z } from "zod";

export const drugSchema = z.object({
  drug_code: z.string().max(255, "Too long").min(1, "Drug code is required"),
  description: z.string().min(1, "Description is required"),
  designation: z.string().max(255, "Too long").min(1, "Designation is required"),
  instruction: z.string().max(255, "Too long"),
  drugCategory: z.string().max(255, "Too long").min(1, "Selling unit is required"),
});

export const createPurchaseSchema = z.object({
  note: z.string().max(255, "Too long").optional(),
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
        batchNumber: z.string().max(255, "Too long").optional(),
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
