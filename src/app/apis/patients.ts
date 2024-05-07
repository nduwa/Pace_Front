import { IPaged, IUUID } from "../types/common";
import { IPatient, IPatientRequest, IPatientsResponse } from "../types/pharmacy";
import api from "./api";

export const createPatient = async (data: IPatientRequest): Promise<IPatient> => {
  return (await api.post("/patients", data)).data;
};

export const updatePatient = async (data: IPatientRequest): Promise<IPatient> => {
  return (await api.put(`/patients/${data.id}`, data)).data;
};

export const addDependent = async (data: IPatientRequest): Promise<IPatient> => {
  return (await api.post(`/patients/${data.id}/dependents`, data)).data;
};

export const deletePatient = async (id: IUUID): Promise<number> => {
  return (await api.delete(`/patients/${id}`)).data;
};

export const getPatient = async (id: IUUID): Promise<IPatient> => {
  return (await api.get(`/patients/${id}`)).data;
};

export const getPatients = async (
  params?: string,
): Promise<IPaged<IPatientsResponse>> => {
  const queryParams = params ? params : "";
  return (await api.get(`/patients${queryParams}`)).data;
};

export const getpatients = async (): Promise<IPatient[]> => {
  return (await api.get(`/patients/all`)).data.data;
};
