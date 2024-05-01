import { IInstitution } from "./common";

export interface IDrugCategory {
  id: string;
  name: string;
  createdAt: Date;
}

export interface IDrugCategoryRequest
  extends Omit<IDrugCategory, "id" | "createdAt"> {
  id?: string;
}

export interface IDrugCategoryResponse {
  rows: IDrugCategory[];
}

export interface IDrug {
  id: string;
  drug_code: string;
  description: string;
  designation: string;
  instruction: string | null;
  drugCategory: string;
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
  drugCategory: string;
  rows: IDrug[];
}

export interface IPurchaseDrugDTO {
  drug: string;
  qty: number;
  unitPrice: number;
  sellingPrice: number;
  batchNumber: string;
  expireDate: Date | string;
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
  expireDate?: string | undefined | null;
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
  expireDate: string | Date | null;
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
  batchNumber: string | null;
  expireDate: string | Date | null;
  sellingPrice: number;
  totalPrice: number;
  drugs?: IInstitutionDrug[];
  drug?: IDrug;
  purchase?: IPurchase;
  createdAt: Date;
}

export interface IPurchaseWithDrugs extends IPurchase {
  drugs: IDrugPurchase[];
  drugsList: IInstitutionDrug[];
}

export interface IDrugPurchaseResponse {
  rows: IDrugPurchase[];
}
