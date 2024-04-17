import { z } from "zod";

export const drugSchema = z.object({
  drug_code: z.string().min(1, "Drug code is required"),
  description: z.string().min(1, "Description is required"),
  designation: z.string().min(1, "Designation is required"),
  instruction: z.string(),
  sellingUnit: z.string().min(1, "Selling unit is required"),
  price: z.coerce.number().min(1, "Price is required"),
});

const isUniqueDrugStock = (drugs: Array<{ drug: string }>) => {
  const drugSet = new Set<string>();
  for (const { drug } of drugs) {
    if (drugSet.has(drug)) {
      return false;
    }
    drugSet.add(drug);
  }
  return true;
};

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
      }),
    )
    .min(1)
    .refine((data) => isUniqueDrugStock(data), {
      message: "Drug must be unique",
    }),
});

const isBatchNumberUnique = (drugs: Array<{ batchNumber: string }>) => {
  const drugSet = new Set<string>();
  for (const { batchNumber } of drugs) {
    if (drugSet.has(batchNumber!)) {
      return false;
    }
    if (batchNumber.trim().length > 0) {
      drugSet.add(batchNumber);
    }
  }
  return true;
};

export const purchaseDrugsSchema = z.object({
  drugs: z
    .array(
      z.object({
        id: z.string(),
        batchNumber: z.string().optional(),
      }),
    )
    .refine(
      (data) =>
        isBatchNumberUnique(
          data.map((drug) => ({
            batchNumber: drug.batchNumber as string,
          })),
        ),
      { message: "Batch numbers has to be unique" },
    ),
});

export type IPurchaseDrugs = z.infer<typeof purchaseDrugsSchema>;
