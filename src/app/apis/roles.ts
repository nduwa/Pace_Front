import {
  IPermission,
  IPermissionsGroup,
  IRoleRequest,
  IRole,
} from "../types/common";
import api from "./api";

export const getGroupedPermissions = async (): Promise<IPermissionsGroup[]> => {
  const { data } = await api.get("/roles/permissions");
  return data;
};

export const getAppPermissions = async (): Promise<IPermission[]> => {
  const { data } = await api.get("/roles/app/permissions");
  return data;
};
export const createRole = async (data: IRoleRequest): Promise<IRole> => {
  return (await api.post("/roles", data)).data;
};
export const updateRole = async (data: {
  role: IRoleRequest;
  id: string;
}): Promise<IRole> => {
  return (await api.put(`/roles/${data.id}`, data.role)).data;
};
export const getRole = async (id: string): Promise<IRole> => {
  return (await api.get(`/roles/${id}`)).data;
};

export const getRoles = async (): Promise<IRole[]> => {
  return (await api.get("/roles")).data;
};

export const getRolesList = async (): Promise<IRole[]> => {
  return (await api.get("/roles/list")).data;
};

export const deleteRole = async (id: string): Promise<number> => {
  return (await api.delete(`/roles/${id}`)).data;
};
