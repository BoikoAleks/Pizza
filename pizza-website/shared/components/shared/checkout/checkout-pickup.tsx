"use client";

import { useFormContext } from "react-hook-form";
import { CheckoutFormValues } from "@/shared/constants";
import { WhiteBlock } from "../white-block";
import { cn } from "@/shared/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/ui/form";

import { RadioGroup, Radio } from "@heroui/radio";

import { Building2, MapPin } from "lucide-react";
import { Label } from "../../ui/label";

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
    <WhiteBlock title="3. Оберіть точку самовивозу" className={cn(className)}>
      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="space-y-4"
              >
                {points.map((point) => (
                  <Label
                    key={point.id}
                    htmlFor={`pickup-${point.id}`}
                    className={cn(
                      "flex items-start gap-4 border rounded-lg p-4 transition-all cursor-pointer",

                      field.value === point.address
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    <Radio
                      id={`pickup-${point.id}`}
                      value={point.address}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-lg flex items-center gap-2">
                        <Building2 size={18} className="text-primary" />
                        {point.name}
                      </p>
                      <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <MapPin size={16} className="text-gray-400" />
                        {point.address}
                      </p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage className="mt-4" />
          </FormItem>
        )}
      />
    </WhiteBlock>
  );
};
