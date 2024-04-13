import api from "./api";
import { IImport, IImportResult } from "../types/common";

export const importUsers = async ({ file }: IImport): Promise<IImportResult> => {
  return (await api.post("/import/drugs", file)).data;
};
