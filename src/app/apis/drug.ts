import { IPaged, IUUID } from "../types/common";
import { IDrug, IDrugRequest, IDrugResponse } from "../types/pharmacy";
import api from "./api";

export const createDrug = async (data: IDrugRequest): Promise<IDrug> => {
  return (await api.post("/drugs", data)).data;
};

export const updateDrug = async (data: IDrugRequest): Promise<IDrug> => {
  return (await api.put(`/drugs/${data.id}`, data)).data;
};

export const deleteDrug = async (id: IUUID): Promise<number> => {
  return (await api.delete(`/drugs/${id}`)).data;
};

export const getDrug = async (id: IUUID): Promise<IDrug> => {
  return (await api.get(`/drugs/${id}`)).data;
};

export const getDrugs = async (params?: string): Promise<IPaged<IDrugResponse>> => {
  const queryParams = params ? params : "";
  return (await api.get(`/drugs${queryParams}`)).data;
};

export const getDrugsNPaged = async (): Promise<IDrug[]> => {
  return (await api.get(`/drugs/all`)).data.data;
};

export const getSellingUnits = async (): Promise<string[]> => {
  return (await api.get(`/drugs/categories`)).data;
};
