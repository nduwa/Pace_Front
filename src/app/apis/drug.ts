import { IPaged, IUUID } from "../types/common";
import {
  IAdjustPurchaseDTO,
  ICreatePurchaseDTO,
  IDrug,
  IDrugCategory,
  IDrugCategoryRequest,
  IDrugCategoryResponse,
  IDrugPurchaseResponse,
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

export const getdrugCategorys = async (): Promise<string[]> => {
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

export const getDrugsByPruchase = async (
  purchasesId: string,
): Promise<IInstitutionDrug[]> => {
  return (await api.get(`/purchases/drugs-purchases/${purchasesId}`)).data;
};

export const getDrugsPurchaseHistory = async (
  params?: string,
): Promise<IPaged<IDrugPurchaseResponse>> => {
  const queryParams = params ? params : "";
  return (await api.get(`/purchases/drugs-purchases${queryParams}`)).data;
};

export const createDrugCategory = async (
  data: IDrugCategoryRequest,
): Promise<IDrugCategory> => {
  return (await api.post("/drug-categories", data)).data;
};

export const updateDrugCategory = async (
  data: IDrugCategoryRequest,
): Promise<IDrugCategory> => {
  return (await api.put(`/drug-categories/${data.id}`, data)).data;
};

export const deleteDrugCategory = async (id: IUUID): Promise<number> => {
  return (await api.delete(`/drug-categories/${id}`)).data;
};

export const getDrugCategory = async (id: IUUID): Promise<IDrugCategory> => {
  return (await api.get(`/drug-categories/${id}`)).data;
};

export const getdrugCategories = async (
  params?: string,
): Promise<IPaged<IDrugCategoryResponse>> => {
  const queryParams = params ? params : "";
  return (await api.get(`/drug-categories${queryParams}`)).data;
};

export const getdrugCategoriesNPaged = async (): Promise<IDrugCategory[]> => {
  return (await api.get(`/drug-categories/all`)).data;
};
