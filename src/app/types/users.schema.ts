import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone number"),
  job_title: z.string().optional(),
  department_id: z.string().optional().nullable(),
  date_of_birth: z.string().optional(),
  starting_date: z.string().min(1, "Invalid date"),
  working_days: z.coerce.number().min(1, "Select days"),
  gender: z
    .string({ invalid_type_error: "Gender is required" })
    .min(1, "Gender is required"),
});

export const assignPermissionsSchema = z.object({
  roles: z
    .array(z.string(), {
      required_error: "Select at least one role",
      invalid_type_error: "Select at least one role",
    })
    .optional(),
  permissions: z
    .array(z.string(), {
      required_error: "Select at least one role",
      invalid_type_error: "Select at least one role",
    })
    .optional(),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone number"),
  job_title: z.string().min(1, "Invalid value"),
  department_id: z.string().optional().nullable(),
  date_of_birth: z.string().optional(),
  starting_date: z.string().min(1, "Invalid date"),
  working_days: z.coerce.number().min(1, "Select days"),
  gender: z
    .string({ invalid_type_error: "Gender is required" })
    .min(1, "Gender is required"),
});

export type ICreateUser = z.infer<typeof createUserSchema>;
export type IUpdateUserSchemaType = z.infer<typeof updateUserSchema>;
export type assignPermissionsSchemaType = z.infer<typeof assignPermissionsSchema>;
