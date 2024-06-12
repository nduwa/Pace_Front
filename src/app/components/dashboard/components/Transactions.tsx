import { FC, useEffect, useState } from "react";
import { IDashboardTransactions } from "../../../types";
import Progress from "../../common/Progress";
import CircularProgressBar from "../../common/CircularProgress";
import { useMutation } from "@tanstack/react-query";
import { transactionsDashboard } from "../../../apis/dashboard";
import TextField from "../../common/form/TextField";
import Button from "../../common/form/Button";
import { FunnelIcon } from "@heroicons/react/24/outline";

type props = {
  transactions: IDashboardTransactions;
};

type calculationsType = {
  expense: number;
  income: number;
  max: number;
  isProfit: boolean;
  diff: number;
  net: number;
};

const TransactionsStatistics: FC<props> = ({ transactions }) => {
  const [calculations, setCalculations] = useState<calculationsType>();

  const calculate = (transactions: IDashboardTransactions) => {
    const expense = transactions.expense + transactions.purchased;
    const income = transactions.income + transactions.invoiced;

    const max = expense > income ? expense : income;

    const isProfit = income > expense;
    const diff = isProfit ? income - expense : expense - income;
    const percentage = ((diff / expense) * 100).toFixed(1); // calculate percentage
    const net = parseFloat(percentage);

    const data = { expense, income, max, isProfit, diff, net: isNaN(net) ? 0 : net };

    setCalculations(data);

    return data;
  };

  const [transactionData, setTransactionsData] = useState(transactions);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const mutation = useMutation(transactionsDashboard);

  const filter = () => {
    mutation.mutate(`?startDate=${startDate}&endDate=${endDate}`, {
      onSuccess(result) {
        setTransactionsData(result);
        calculate(result);
      },
    });
  };

  useEffect(() => {
    if (!calculations) {
      calculate(transactions);
    }
  });

  useEffect(() => {
    console.log("changed");
    calculate(transactions);
  }, [transactions]);

  return (
    <div className='p-8 rounded-lg w-full mt-6'>
      <div className='flex justify-between flex-col md:flex-row'>
        <div className='font-bold uppercase text-md'>TRANSACTIONS</div>
        <div className='flex align-bottom items-end gap-2'>
          <TextField
            type='date'
            label='Start Date'
            onValueChage={(value: string) => setStartDate(value)}
          />
          <TextField
            type='date'
            label='End Date'
            onValueChage={(value: string) => setEndDate(value)}
          />
          <Button icon={<FunnelIcon className='w-5' />} onClick={() => filter()} />
        </div>
      </div>
      <div className='grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mt-6 gap-6'>
        <div className=''>
          <div className='bg-white p-8 rounded-xl shadow-lg'>
            <div className='grid grid-cols-2 gap-6 '>
              <div>
                <div className='text-gray-400 font-light'>INCOME</div>
                <div className='font-bold text-gray-900 text-lg'>
                  {transactionData.income} RWF
                </div>
              </div>
              <div>
                <div className='text-gray-400 font-light'>EXPENSE</div>
                <div className='font-bold text-gray-900 text-lg'>
                  {transactionData.expense} RWF
                </div>
              </div>

              <div>
                <div className='text-gray-400 font-light'>INVOICES</div>
                <div className='font-bold text-gray-900 text-lg'>
                  {transactionData.invoiced} RWF
                </div>
              </div>
              <div>
                <div className='text-gray-400 font-light'>PURCHASES</div>
                <div className='font-bold text-gray-900 text-lg'>
                  {transactionData.purchased} RWF
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=''>
          <div className='bg-white p-8 rounded-xl shadow-lg'>
            {calculations && (
              <div className='flex flex-col w-full gap-8'>
                <div className='flex flex-col gap-3'>
                  <div className='flex  justify-between'>
                    <div className='font-bold text-gray-400 font-light'>Expense</div>
                    <div className='font-bold  text-gray-900'>
                      {calculations.expense} RWF
                    </div>
                  </div>
                  <Progress max={calculations.max} value={calculations.expense} />
                </div>

                <div className='flex flex-col gap-3'>
                  <div className='flex  justify-between'>
                    <div className='font-bold text-gray-400 font-light'>Income</div>
                    <div className='font-bold  text-gray-900'>
                      {calculations.income} RWF
                    </div>
                  </div>
                  <Progress max={calculations.max} value={calculations.income} />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className='bg-white p-4 rounded-xl shadow-lg'>
          {calculations && (
            <CircularProgressBar
              value={calculations.net}
              indicator={`${
                calculations.isProfit ? "stroke-darkblue" : "stroke-red-900"
              }`}
              text={`Net: ${calculations.diff} RWF`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsStatistics;
