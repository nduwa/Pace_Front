import TransactionsPage from "../pages/transactions/TransactionsPage";
import { IRoute } from "../types/common";

const transactionRoutes: IRoute[] = [
  {
    path: "transactions",
    element: TransactionsPage,
  },
];

export default transactionRoutes;
