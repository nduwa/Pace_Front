import { IInstitution, IUser } from "./common";

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
  purchaseNO?: string;
  note?: string;
  date: Date;
  id: string;
  totalCost: number;
  supplier?: string;
  drugsCount: number;
  createdAt: Date;
  updatedAt: Date;

  drugs?: IDrugPurchase[];
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

  totalQuantity?: number;
  drug?: IDrug;
}

export interface IInstitutionDrugResponse {
  rows: IInstitutionDrug[];
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

export interface IPatient {
  id: string;
  name: string;
  gender: string;
  birthDate: string | Date;
  phone: string;
  address: {
    province: string;
    district: string;
    sector: string;
    cell: string;
    village: string;
  };
  patientNO: string;
  NID: string;
  NIDIndex: number;

  invoices?: IInvoice[];
  dependents?: IPatient[];
}

export interface IPatientRequest
  extends Omit<IPatient, "id" | "patientNO" | "NIDIndex"> {
  id?: string;
}

export interface IPatientsResponse {
  rows: IPatient[];
}

export interface IInvoice {
  id: string;
  patientId: string | null;
  institutionId: string;
  note: string;
  name: string;
  phone: string;
  invoiceNO: string;
  drugsCount: number;
  totalCost: number;
  createdAt: Date;
  updatedAt: Date;

  patient?: IPatient;
  institution?: IInstitution;
  drugs?: IInvoiceDrug[];
  user?: IUser;
}

export interface IInvoiceDrug {
  id: string;
  patientId: string | null;
  institutionId: string;
  drugId: string;
  invoiceId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;

  drug?: IDrug;
}

export interface IInvoiceResponse {
  startDate: string;
  endDate: string;
  requester: string;
  rows: IInvoice[];
}

export interface IInvoiceDrugCreateDTO {
  drug: string;
  qty: number;
}
export interface ICreateInvoiceDTO {
  note: string;
  name: string;
  phone: string;
  patientId: string;
  drugs: IInvoiceDrugCreateDTO[];
}
