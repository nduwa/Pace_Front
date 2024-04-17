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
  totalQuantity?: number;
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

export interface IPurchaseDrugDTO {
  drug: string;
  qty: number;
  unitPrice: number;
  sellingPrice: number;
}
export interface ICreatePurchaseDTO {
  note: string;
  date: string;
  supplier: string;
  drugs: IPurchaseDrugDTO[];
}
export interface IPurchase {
  note?: string;
  date: Date;
  id: string;
  totalCost: number;
  supplier?: string;
  drugsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDrugPurchaseAdjust {
  id: string;
  batchNumber?: string | undefined | null;
}
export interface IAdjustPurchaseDTO {
  drugs: IDrugPurchaseAdjust[];
}

export interface IInstitutionDrug {
  id: string;
  drugId: string;
  institutionId: string;
  purchaseId: string;
  drugPurchaseId: string;
  batchNumber: string | null;
  quantity: number;
  price: number;
  isAvailable: boolean;
  itemNo: string;
  createdAt: Date;
  deletedAt: Date;
  updatedAt: Date;
}

export interface IDrugPurchase {
  id: string;
  drugId: string;
  institutionId: string;
  purchaseId: string;
  quantity: number;
  unitPrice: number;
  sellingPrice: number;
  totalPrice: number;
  drug?: IDrug;
  drugs?: IInstitutionDrug[];
}

export interface IPurchaseWithDrugs extends IPurchase {
  drugs: IDrugPurchase[];
  drugsList: IInstitutionDrug[];
}
