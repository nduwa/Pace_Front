import {
  IConsultation,
  IConsultationRequest,
  IConsultationResponse,
  IPaged,
  IUUID,
} from "../types/common";
import api from "./api";

export const createConsultation = async (
  data: IConsultationRequest,
): Promise<IConsultation> => {
  return (await api.post("/consultations", data)).data;
};

export const updateConsultation = async (
  data: IConsultationRequest,
): Promise<IConsultation> => {
  return (await api.put(`/consultations/${data.id}`, data)).data;
};

export const deleteConsultation = async (id: IUUID): Promise<number> => {
  return (await api.delete(`/consultations/${id}`)).data;
};

export const getConsultation = async (id: IUUID): Promise<IConsultation> => {
  return (await api.get(`/consultations/${id}`)).data;
};

export const getConsultations = async (
  params?: string,
): Promise<IPaged<IConsultationResponse>> => {
  const queryParams = params ? params : "";
  return (await api.get(`/consultations${queryParams}`)).data;
};

export const getconsultations = async (): Promise<IConsultation[]> => {
  return (await api.get(`/consultations`)).data.data;
};
