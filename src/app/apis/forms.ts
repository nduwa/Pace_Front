import {
  IForm,
  IFormConsultationRequest,
  IFormExamRequest,
  IFormInvoiceData,
  IFormInvoiceRequest,
  IFormRequest,
  IFormResponse,
  sendFormRequest,
} from "../types/forms";
import api from "./api";
import { IPaged, IUUID } from "../types/common";

export const createForm = async (data: IFormRequest): Promise<IForm> => {
  return (await api.post("/forms", data)).data;
};

export const updateForm = async (data: IFormRequest): Promise<IForm> => {
  return (await api.put(`/forms/${data.id}`, data)).data;
};

export const deleteForm = async (id: IUUID): Promise<number> => {
  return (await api.delete(`/forms/${id}`)).data;
};

export const getForm = async (id: IUUID): Promise<IForm> => {
  return (await api.get(`/forms/${id}`)).data;
};

export const getForms = async (params?: string): Promise<IPaged<IFormResponse>> => {
  const queryParams = params ? params : "";
  return (await api.get(`/forms${queryParams}`)).data;
};

export const getforms = async (): Promise<IForm[]> => {
  return (await api.get(`/forms/all`)).data.data;
};

export const getFormsByLocation = async (location: string): Promise<IForm[]> => {
  return (await api.get(`/forms/by-location?at=${location}`)).data;
};

export const getLocations = async (): Promise<string[]> => {
  return (await api.get(`/forms/locations`)).data;
};

export const examination = async (data: IFormExamRequest): Promise<IForm> => {
  return (await api.post(`/forms/${data.id}/examination`, data)).data;
};

export const consultation = async (
  data: IFormConsultationRequest,
): Promise<IForm> => {
  return (await api.post(`/forms/${data.id}/consultation`, data)).data;
};

export const sendForm = async (data: sendFormRequest): Promise<IForm> => {
  return (await api.post(`/forms/${data.id}/send-form`, data)).data;
};

export const saveInvoice = async (data: IFormInvoiceRequest): Promise<boolean> => {
  return (await api.post(`/forms/${data.id}/save-invoice`, data)).data;
};

export const makeInvoice = async (id: string): Promise<IFormInvoiceData> => {
  return (await api.get(`/forms/${id}/make-invoice`)).data;
};
