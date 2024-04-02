export interface ILoginFormData {
  email: string;
  password: string;
}

export interface IUpdatePasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IResetPasswordRequest {
  email: string;
}

export interface IResetPassword {
  password: string;
  confirmPassword: string;
}