import { IPaged, IUUID } from "../types/common";
import {
  IAdjustPurchaseDTO,
  ICreatePurchaseDTO,
  IDrug,
  IDrugRequest,
  IDrugResponse,
  IInstitutionDrug,
  IPurchase,
  IPurchaseWithDrugs,
} from "../types/pharmacy";
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
  return (await api.get(`/drugs/all`)).data;
};

export const getSellingUnits = async (): Promise<string[]> => {
  return (await api.get(`/drugs/categories`)).data;
};

export const createpurchase = async (
  data: ICreatePurchaseDTO,
): Promise<IPurchase> => {
  return (await api.post(`/purchases`, data)).data;
};

export const adjustDrugs = async (data: IAdjustPurchaseDTO): Promise<IPurchase> => {
  return (await api.post(`/purchases/drugs-purchases`, data)).data;
};

export const getPurchases = async (
  params?: string,
): Promise<IPaged<IPurchase[]>> => {
  return (await api.get(`/purchases${params ? params : ""}`)).data;
};

export const getPurchase = async (id: string): Promise<IPurchaseWithDrugs> => {
  return (await api.get(`/purchases/${id}`)).data;
};

export const getDrugsPurchase = async (
  purchasesId: string,
): Promise<IInstitutionDrug[]> => {
  return (await api.get(`/purchases/drugs-purchases/${purchasesId}`)).data;
};
