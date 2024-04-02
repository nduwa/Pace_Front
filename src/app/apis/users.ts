import { IUpdateUserProfile, IUser, IUserStatus } from "./../types/users.d";
import { IPaged, IUUID, IUserProfile, IUsersResponse } from "../types/common";
import { ICreateUser } from "../utils/schemas/users.schema";
import api from "./api";
export const getAllUsers = async (
  params?: string,
): Promise<IPaged<IUsersResponse>> => {
  const queryParams = params ? params : "";
  return (await api.get(`/users${queryParams}`)).data;
};

export const createUser = async (user: ICreateUser): Promise<IUser> => {
  return (await api.post("/users", user)).data;
};

export const getUser = async (id: IUUID): Promise<IUserProfile> => {
  return (await api.get(`/users/${id}`)).data;
};

export const getHRUsers = async (): Promise<IUserProfile[]> => {
  return (await api.get(`/users/hr-users`)).data;
};

export const getDrivers = async (): Promise<IUserProfile[]> => {
  return (await api.get(`/users/drivers`)).data;
};

export const getMechanicians = async (): Promise<IUserProfile[]> => {
  return (await api.get(`/users/mechanicians`)).data;
};

export const updateUserStatus = async (data: IUserStatus): Promise<IUserStatus> => {
  return (await api.put(`/users/${data.id}/status`, data)).data;
};
// New feature: Admin can update employee profile
export const updateUserProfile = async (
  data: IUpdateUserProfile,
): Promise<IUser> => {
  return (await api.put(`/users/${data.id}/profile`, data)).data;
};
