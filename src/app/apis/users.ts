import { IUpdateUserProfile, IUser } from "./../types/users.d";
import {
  IAssignPermissionsRequest,
  IPaged,
  IUUID,
  IUserProfile,
  IUserWithPermissions,
  IUsersResponse,
} from "../types/common";
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

export const getUser = async (id: IUUID): Promise<IUserWithPermissions> => {
  return (await api.get(`/users/${id}`)).data;
};

// New feature: Admin can update employee profile
export const updateUserProfile = async (
  data: IUpdateUserProfile,
): Promise<IUser> => {
  return (await api.put(`/users/${data.id}/profile`, data)).data;
};

export const assignPermissions = async (
  data: IAssignPermissionsRequest,
): Promise<IUserProfile> => {
  return (await api.post(`/users/${data.id}/permissions`, data)).data;
};
