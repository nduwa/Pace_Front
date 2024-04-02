import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone number"),
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
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone number"),
});

export type ICreateUser = z.infer<typeof createUserSchema>;
export type IUpdateUserSchemaType = z.infer<typeof updateUserSchema>;
export type assignPermissionsSchemaType = z.infer<typeof assignPermissionsSchema>;
