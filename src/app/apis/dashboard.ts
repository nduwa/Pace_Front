import api from "./api";

export const dashboard = async (): Promise<string> => {
  const { data } = await api.get("/dashboard");
  return data;
};
