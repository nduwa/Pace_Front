import { FC } from "react";
import { IPurchase } from "../../types/pharmacy";

interface IProps {
  data: IPurchase;
  closeDrawer?: () => void;
}
const PurchaseAdjustement: FC<IProps> = ({ data }) => {
  return (
    <div className='relative'>
      <div className='w-full relative'>
        <table cellPadding={2} className='w-full'>
          <thead>
            <tr>
              <th>#{data.purchaseNO}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data?.drugs?.map((drug) => (
              <tr key={drug.id} className='border'>
                <td className='px-1.5 py-2'>{drug.drug?.designation}</td>
                <td className='px-1.5 py-2'>{drug.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseAdjustement;
