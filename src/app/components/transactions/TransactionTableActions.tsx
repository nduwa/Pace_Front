import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import { ITransaction } from "../../types/common";
import Modal from "../common/Modal";
import TransactionForm from "./TransactionForm";
import ConfirmDelete from "../common/ConfirmDelete";
import { deleteTransaction } from "../../apis/transaction";
import { TRANSACTION } from "../../utils/constants/queryKeys";

interface ITransactionTableActionsProps {
  transaction: ITransaction;
}

const TransactionTableActions: FC<ITransactionTableActionsProps> = ({
  transaction,
}) => {
  const { id } = transaction;
  const [toUpdate, setToUpdate] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [toDelete, setToDelete] = useState<string | undefined>();

  const update = (id: string) => {
    setToUpdate(id);
  };

  return (
    <>
      {isOpen && (
        <div id={id} className='w-full'>
          <div
            className='flex gap-2 py-1 px-2 hover:bg-gray-100 cursor-pointer'
            onClick={() => update(id)}
          >
            <PencilIcon className='w-4 text-green' /> Edit
          </div>
          {toUpdate != "" && (
            <Modal
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              title={`Update ${transaction.reason}`}
            >
              <TransactionForm transaction={transaction} setIsOpen={setIsOpen} />
            </Modal>
          )}

          {toDelete && (
            <ConfirmDelete
              type='transaction'
              id={toDelete}
              fn={async (id: string) => {
                await deleteTransaction(id);
                return 1;
              }}
              queryKey={TRANSACTION}
              setToDelete={setToDelete}
            />
          )}
          <div
            className='flex gap-2 py-1 px-2 hover:bg-gray-100 cursor-pointer'
            onClick={() => setToDelete(id)}
          >
            <TrashIcon className='w-4 text-red' /> Delete
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionTableActions;
