"use client";

import { useFormContext } from "react-hook-form";
import { CheckoutFormValues } from "@/shared/constants";
import { WhiteBlock } from "../white-block"; // 1. Імпортуємо ваш компонент WhiteBlock
import { cn } from "@/shared/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/shared/components/ui/radio-group";
import { Label } from "@/shared/components/ui/label";

// Типізуємо наші точки самовивозу
interface PickupPoint {
  id: number;
  name: string;
  address: string;
}

interface Props {
  className?: string;
  points: PickupPoint[];
}

export const CheckoutPickup = ({ className, points }: Props) => {
  const { control } = useFormContext<CheckoutFormValues>();

  return (
    // 2. Використовуємо WhiteBlock, як у вашому CheckoutAddressForm
    <WhiteBlock
      title="3. Інформація про самовивіз"
      className={cn(className)}
    >
      {/* 3. Всю логіку вибору точки розміщуємо всередині */}
      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="space-y-3"
              >
                {points.map((point) => (
                  <FormItem
                    key={point.id}
                    className="flex items-center space-x-3 space-y-0 border rounded-md p-4 cursor-pointer hover:bg-gray-50"
                  >
                    <FormControl>
                      <RadioGroupItem value={point.address} />
                    </FormControl>
                    <Label className="font-normal cursor-pointer w-full">
                      <p className="font-bold">{point.name}</p>
                      <p className="text-gray-600">{point.address}</p>
                    </Label>
                  </FormItem>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </WhiteBlock>
  );
};