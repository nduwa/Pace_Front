export interface IDrugFilter {
  isOnMarket?: string;
  drugCategory?: string;
}

export interface IPatientInvoiceFilter {
  startDate: string;
  endDate: string;
  type: string;
  institution: string;
}

export interface IInvoiceFilter {
  startDate: string;
  endDate: string;
  requester: string;
}

export interface ITransactionFilter {
  startDate: string;
  endDate: string;
  type: string;
}

export interface IFormFilter {
  at: string;
  isOpen: string;
}
