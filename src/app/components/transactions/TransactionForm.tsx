import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, FC, SetStateAction } from "react";
import toast from "react-hot-toast";
import { ITransaction, ITransactionRequest } from "../../types/common";
import { createTransaction, updateTransaction } from "../../apis/transaction";
import { TRANSACTIONS } from "../../utils/constants/queryKeys";
import TextField from "../common/form/TextField";
import OptionsField from "../common/form/OptionsField";
import Button from "../common/form/Button";
import { transactionSchema } from "../../utils/schemas/transaction.schem";

interface ITransactionForm {
  transaction?: ITransaction;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const TransactionForm: FC<ITransactionForm> = ({ transaction, setIsOpen }) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ITransactionRequest>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      ...transaction,
    },
  });

  const createTransactionMutation = useMutation(createTransaction);
  const updateTransactionMutation = useMutation(updateTransaction);

  const onSubmit = (data: ITransactionRequest) => {
    if (transaction && transaction.id) {
      updateTransactionMutation.mutate(
        { id: transaction.id, ...data } as ITransaction,
        {
          onSuccess() {
            toast.success("Transaction updated successfully");
            setIsOpen(false);
            queryClient.invalidateQueries(TRANSACTIONS);
            reset();
          },
        },
      );
    } else {
      createTransactionMutation.mutate(data, {
        onSuccess() {
          toast.success("Transaction created successfully");
          setIsOpen(false);
          queryClient.invalidateQueries(TRANSACTIONS);
          reset();
        },
      });
    }
  };

  const transactionTypes = ["INCOME", "EXPENSE"];

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='flex gap-4 flex-col'>
        <div className='grid grid-cols-2 gap-4'>
          <OptionsField
            label='Type'
            register={register("type")}
            error={errors.type?.message}
            required={true}
            defaultLabel='Select type'
            options={transactionTypes?.map((type) => ({
              value: type,
              label: type,
            }))}
          />
          <TextField
            label='Amount'
            type='text'
            error={errors.amount?.message}
            register={register("amount")}
          />
        </div>
        <div className='block'>
          <TextField
            label='Reason'
            type='text'
            error={errors.reason?.message}
            register={register("reason")}
          />
        </div>

        <div className='grid'>
          <TextField
            label='Reference'
            type='text'
            error={errors.reference?.message}
            register={register("reference")}
          />
        </div>
        <div className='grid'></div>
        <div className='py-4 mx-auto flex items-center justify-end md:justify-start md:flex-start space-x-2'>
          <Button
            isLoading={
              transaction && transaction.id
                ? updateTransactionMutation.isLoading
                : createTransactionMutation.isLoading
            }
            label={
              transaction && transaction.id
                ? "Update Transaction"
                : "Create Transaction"
            }
          />
        </div>
      </form>
    </>
  );
};

export default TransactionForm;
