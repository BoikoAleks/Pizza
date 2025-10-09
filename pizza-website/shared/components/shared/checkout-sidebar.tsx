import { ArrowRight, Package, Truck } from "lucide-react";
import { CheckoutItemDetails } from "./checkout-item-details";
import { WhiteBlock } from "./white-block";
import { Button, Skeleton } from "../ui";
import { cn } from "@/shared/lib/utils";

interface Props {
  totalAmount: number;
  className?: string;
  loading: boolean;
  deliveryMethod?: 'delivery' | 'pickup';
  deliveryPrice?: number;
}

const DELIVERY_PRICE = 100;

export const CheckoutSidebar: React.FC<Props> = ({
  className,
  totalAmount,
  loading,
  deliveryMethod = 'delivery',
  deliveryPrice = DELIVERY_PRICE,
}) => {
  return (
    <WhiteBlock className={cn("p-6 sticky top-4", className)}>
      <div className="flex flex-col gap-1">
        <span className="text-xl"> Загальна сума: </span>
        {loading ? (
          <Skeleton className="h-11 w-48" />
        ) : (
          <span className="h-11 text-[34px] font-bold">
            {deliveryMethod === 'delivery' ? totalAmount + deliveryPrice : totalAmount} грн
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
            <Skeleton className="h-6 w-16 rounded-[6px]" />
          ) : (
            `${totalAmount} грн`
          )
        }
      />
      {deliveryMethod === 'delivery' && (
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
              `${deliveryPrice} грн`
            )
          }
        />
      )}
      {/* When pickup is selected we don't show an extra delivery line */}

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
