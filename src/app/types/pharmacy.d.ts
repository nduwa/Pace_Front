import { IInstitution } from "./common";

export interface IDrug {
  id: string;
  drug_code: string;
  description: string;
  designation: string;
  instruction: string | null;
  sellingUnit: string;
  price: number;
  isOnMarket: boolean;

  createdAt: Date;

  institution?: IInstitution;
}

export interface IDrugRequest
  extends Omit<IDrug, "id" | "createdAt" | "isOnMarket"> {
  id?: string;
}

export interface IDrugResponse {
  isOnMarket: string;
  sellingUnit: string;
  rows: IDrug[];
}
