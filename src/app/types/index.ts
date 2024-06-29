import { ReactElement } from "react";

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface SidebarLinkProps {
  text: string;
  Icon: ReactElement;
  to: string;
}

export interface IDashboard {
  drugsCount: number;
  drugsInStock: number;
  usersCount: number;
  examsCount: number;
  institutionsCount: number;
  institutionBranchesCount: number;
  openFormsCount: number;
}

export interface IDashboardTransactions {
  income: number;
  expense: number;
  purchased: number;
  invoiced: number;
}
