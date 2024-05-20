import {
  ICreateBranch,
  IInstitution,
  IInstitutionRequest,
  IInstitutionResponse,
  IPaged,
  IUUID,
} from "../types/common";
import api from "./api";

export const createInstitution = async (
  data: IInstitutionRequest,
): Promise<IInstitution> => {
  return (await api.post("/institutions", data)).data;
};

export const createBranch = async (data: ICreateBranch): Promise<IInstitution> => {
  return (await api.post("/institutions/branches", data)).data;
};

export const updateInstitution = async (
  data: IInstitutionRequest,
): Promise<IInstitution> => {
  return (await api.put(`/institutions/${data.id}`, data)).data;
};

export const deleteInstitution = async (id: IUUID): Promise<number> => {
  return (await api.delete(`/institutions/${id}`)).data;
};

export const getInstitution = async (id: IUUID): Promise<IInstitution> => {
  return (await api.get(`/institutions/${id}`)).data;
};

export const getInstitutions = async (
  params?: string,
): Promise<IPaged<IInstitutionResponse>> => {
  const queryParams = params ? params : "";
  return (await api.get(`/institutions${queryParams}`)).data;
};

export const getinstitutions = async (): Promise<IInstitution[]> => {
  return (await api.get(`/institutions/all`)).data;
};
