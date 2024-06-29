import { IDashboard, IDashboardTransactions } from "../types";
import api from "./api";

export const dashboard = async (): Promise<IDashboard> => {
  const { data } = await api.get("/dashboard");
  return data;
};

export const transactionsDashboard = async (
  params: string,
): Promise<IDashboardTransactions> => {
  const { data } = await api.get(`/dashboard/transactions/${params}`);
  return data;
};
