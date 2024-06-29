import { IExam, IExamRequest, IExamResponse } from "../types/exams";
import api from "./api";
import { IPaged, IUUID } from "../types/common";
import { IPriceChange } from "../types/pharmacy";

export const createExam = async (data: IExamRequest): Promise<IExam> => {
  return (await api.post("/exams", data)).data;
};

export const updateExam = async (data: IExamRequest): Promise<IExam> => {
  return (await api.put(`/exams/${data.id}`, data)).data;
};

export const deleteExam = async (id: IUUID): Promise<number> => {
  return (await api.delete(`/exams/${id}`)).data;
};

export const getExam = async (id: IUUID): Promise<IExam> => {
  return (await api.get(`/exams/${id}`)).data;
};

export const getExams = async (params?: string): Promise<IPaged<IExamResponse>> => {
  const queryParams = params ? params : "";
  return (await api.get(`/exams${queryParams}`)).data;
};

export const getexams = async (): Promise<IExam[]> => {
  return (await api.get(`/exams/all`)).data;
};

export const updateExamPrice = async (data: IPriceChange): Promise<IExam> => {
  return (await api.put(`/exams/${data.id}/prices`, data)).data;
};
