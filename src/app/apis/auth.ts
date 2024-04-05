import {
  ILoginFormData,
  IResetPassword,
  IResetPasswordRequest,
  IUpdatePasswordFormData,
} from "../types/auth";
import { AuthState, ChangeInstitution } from "./../types/common.d";
import api from "./api";

export const login = async (formData: ILoginFormData): Promise<AuthState> => {
  const { data } = await api.post("/auth/login", formData);
  return data;
};

export const updatePassword = async (data: IUpdatePasswordFormData) => {
  const response = await api.put("/auth/update-password", data);
  return response.data;
};

export const resetPasswordRequest = async (data: IResetPasswordRequest) => {
  const response = await api.post("/auth/reset-password-request", data);
  return response.data;
};

export const resetPassword = async (data: IResetPassword) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};

export const changeInstitution = async (data: ChangeInstitution) => {
  const response = await api.post("/auth/change-institution", data);
  return response.data;
};
