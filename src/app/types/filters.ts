export interface ILeaveBalanceFilters {
  department: string;
}

export interface IUserTableFilters {
  department: string;
  role: string;
  gender: string;
}

export interface IJobcardTableFilters {
  vehicle: string;
  status: string;
  startDate: string;
  endDate: string;
}

export interface IRequisitionTableFilters {
  status: string;
  requester: string;
  stock: string;
  startDate: string;
  endDate: string;
}

export interface IVehicleTableFilters {
  brand: string;
}

export interface ILeaveTableFilters {
  userId?: string;
  requesterId?: string;
  departmentId?: string;
  year?: string;
  type?: string;
  leaveType?: string;
  status?: string;
}
