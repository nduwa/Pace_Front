import {
  ITransaction,
  ITransactionRequest,
  ITransactionResponse,
  IPaged,
  IUUID,
} from "../types/common";
import api from "./api";

export const createTransaction = async (
  data: ITransactionRequest,
): Promise<ITransaction> => {
  return (await api.post("/transactions", data)).data;
};

export const updateTransaction = async (
  data: ITransactionRequest,
): Promise<ITransaction> => {
  return (await api.put(`/transactions/${data.id}`, data)).data;
};

export const deleteTransaction = async (id: IUUID): Promise<number> => {
  return (await api.delete(`/transactions/${id}`)).data;
};

export const getTransaction = async (id: IUUID): Promise<ITransaction> => {
  return (await api.get(`/transactions/${id}`)).data;
};

export const getTransactions = async (
  params?: string,
): Promise<IPaged<ITransactionResponse>> => {
  const queryParams = params ? params : "";
  return (await api.get(`/transactions${queryParams}`)).data;
};

export const gettransactions = async (): Promise<ITransaction[]> => {
  return (await api.get(`/transactions`)).data.data;
};
