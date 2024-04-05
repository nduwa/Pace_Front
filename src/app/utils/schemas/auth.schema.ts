import { ZodType, z } from "zod";
import { ILoginFormData, IResetPassword } from "../../types/auth";
import { IResetPasswordRequest } from "../../types/auth";
import { IUpdatePasswordFormData } from "../../types/auth";

export const LoginSchema: ZodType<ILoginFormData> = z.object({
  email: z
    .string({
      required_error: "Email address is required",
      invalid_type_error: "Email format is invalid",
    })
    .email(),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(4, "Password should be atleast 6 characters"),
});

export const ForgotPasswordSchema: ZodType<IResetPasswordRequest> = z.object({
  email: z
    .string({
      required_error: "Email address is required",
      invalid_type_error: "Email format is invalid",
    })
    .email(),
});

export const ResetPasswordSchema: ZodType<IResetPassword> = z.object({
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password should be atleast 6 characters"),
  confirmPassword: z
    .string({
      required_error: "Confirm password is required",
    })
    .min(6, "Password should be atleast 6 characters"),
});

export const UpdatePasswordSchema: ZodType<IUpdatePasswordFormData> = z.object({
  oldPassword: z
    .string({
      required_error: "Old password is required",
    })
    .min(6, "Password should be at least 6 characters"),
  newPassword: z
    .string({
      required_error: "New password is required",
    })
    .min(6, "Password should be at least 6 characters"),
  confirmPassword: z
    .string({
      required_error: "Confirm password is required",
    })
    .min(6, "Password should be at least 6 characters"),
});

export const changeInstitutionSchema = z.object({
  institutionId: z.string().min(1, "Select one"),
});
