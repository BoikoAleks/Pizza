import { ArrowRight, Package, Truck } from "lucide-react";
import { CheckoutItemDetails } from "./checkout-item-details";
import { WhiteBlock } from "./white-block";
import { Button, Skeleton } from "../ui";
import { cn } from "@/shared/lib/utils";


interface Props {
  totalAmount: number;
  className?: string;
  loading: boolean;
}

const DELIVERY_PRICE = 150;

export const CheckoutSidebar: React.FC<Props> = ({
  className,
  totalAmount,
  loading,
}) => {
  return (
    <WhiteBlock className={cn("p-6 sticky top-4", className)}>
      <div className="flex flex-col gap-1">
        <span className="text-xl"> Загальна сума: </span>
        {loading ? (
          <Skeleton className="h-11 w-48" />
        ) : (
          <span className="h-11 text-[34px] font-bold">
            {totalAmount + DELIVERY_PRICE} грн
          </span>
        )}
      </div>

      <CheckoutItemDetails
        title={
          <div className="flex items-center ">
            <Package size={18} className="mr-2 text-gray-400" />
            Сума замовлення:
          </div>
        }
        value={
          loading ? (
            <Skeleton className="h-6 w-14 rounded-[6px]" />
          ) : (
            `${totalAmount} грн`
          )
        }
      />
      <CheckoutItemDetails
        title={
          <div className="flex items-center ">
            <Truck size={18} className="mr-2 text-gray-400" />
            Вартість доставки:
          </div>
        }
        value={
          loading ? (
            <Skeleton className="h-6 w-14 rounded-[6px]" />
          ) : (
            `${DELIVERY_PRICE} грн`
          )
        }
      />

      <Button
        loading={loading}
        type="submit"
        
        className="w-full h-14 rounded-2xl mt-6 text-base font-bold"
      >
        Оформити замовлення
        <ArrowRight className="w-5 ml-2" />
      </Button>
    </WhiteBlock>
  );
};
