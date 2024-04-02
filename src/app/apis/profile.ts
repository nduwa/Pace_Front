import api from "./api";
import { IUserWithPermissions } from "../types/common";

export const getMyProfile = async (): Promise<IUserWithPermissions> => {
  const { data } = await api.get("/auth");
  return data;
};
