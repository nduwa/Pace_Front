import { IUser } from "./auth";
import { IDrug, IInvoice, IPatient } from "./drugs";
import { IExam } from "./exams";
import { IConsultation, IInstitution } from "./instutution";

export interface IForm {
  id: string;
  institutionId: string;
  patientId: string;
  formNO: string;
  at: string;
  from: string;
  isOpen: boolean;
  details: {
    temperature: number | null;
    weight: number | null;
    height: number | null;
  };

  createdAt: Date;
  updatedAt: Date;

  patient?: IPatient;
  institution?: IInstitution;
  drugs?: IFormDrug[];
  exams?: IFormExam[];
  consultations?: IFormConsultation[];
}

export interface IFormResponse {
  isOpen: string;
  at: string;
  rows: IForm[];
}

export interface IFormConsultation {
  id: string;
  consultationId: string;
  patientId: string;
  formId: string;
  userId: string | null;
  invoiceId: string | null;
  verdict: string;
  price: number;

  createdAt: Date;
  updatedAt: Date;

  invoice?: IInvoice;
  consultation?: IConsultation;
  user?: IUser;
}

export interface IFormExam {
  id: string;
  examId: string;
  patientId: string;
  formId: string;
  userId: string | null;
  invoiceId: string | null;
  institutionId: string | null;
  result: boolean;
  comment: string;
  price: number;

  createdAt: Date;
  updatedAt: Date;

  invoice?: IInvoice;
  exam?: IExam;
  user?: IUser;
}

export interface IFormDrug {
  id: string;
  drugId: string;
  patientId: string;
  formId: string;
  userId: string | null;
  invoiceId: string | null;
  quantity: number;
  givenQuantity: number;
  prescription: string;
  price: number;

  createdAt: Date;
  updatedAt: Date;

  invoice?: IInvoice;
  drug?: IDrug;
  user?: IUser;
}

export interface IFormRequest
  extends Pick<IForm, "patientId" | "details" | "at" | "from"> {
  id?: string;
}

export type FormAddDrug = {
  drugId: string;
  quantity: number;
  prescription: string;
};

export type FormAddExam = {
  examId: string;
};

export type IFormConsultationRequest = {
  id?: string;
  consultationId: string;
  verdict: string;
  drugs: FormAddDrug[];
  exams: FormAddExam[];
};

export type IFormExamRequest = {
  id: string;
  exams: {
    examId: string;
    result: boolean | string | null;
    comment: string;
  }[];
};

export type sendFormRequest = {
  id: string;
  to: string;
};

export type IInvoiceExamData = {
  id: string;
  exam?: IExam;
  price: number;
};

export type IInvoiceConsultationData = {
  id: string;
  consultation?: IConsultation;
  price: number;
};

export type IInvoiceDrugData = {
  id: string;
  drug?: IDrug;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
};

export interface IFormInvoiceData {
  invoice: IInvoice;
  form: IForm;
  invoiceConsultations: IInvoiceConsultationData[];
  invoiceExams: IInvoiceExamData[];
  invoiceDrugs: IInvoiceDrugData[];
}

export interface IFormInvoiceRequest {
  id?: string;
  invoiceConsultations: IInvoiceConsultationData[];
  invoiceExams: IInvoiceExamData[];
  invoiceDrugs: IInvoiceDrugData[];
}
