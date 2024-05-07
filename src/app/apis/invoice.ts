import { IPaged, IUUID } from "../types/common";
import { ICreateInvoiceDTO, IInvoice, IInvoiceResponse } from "../types/pharmacy";
import api from "./api";

export const createInvoice = async (data: ICreateInvoiceDTO): Promise<IInvoice> => {
  return (await api.post("/invoices", data)).data;
};

export const deleteInvoice = async (id: IUUID): Promise<number> => {
  return (await api.delete(`/invoices/${id}`)).data;
};

export const getInvoice = async (id: IUUID): Promise<IInvoice> => {
  return (await api.get(`/invoices/${id}`)).data;
};

export const getInvoices = async (
  params?: string,
): Promise<IPaged<IInvoiceResponse>> => {
  const queryParams = params ? params : "";
  return (await api.get(`/invoices${queryParams}`)).data;
};
