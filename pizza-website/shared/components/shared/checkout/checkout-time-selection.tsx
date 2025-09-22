"use client";

import { useFormContext } from "react-hook-form";
import { WhiteBlock } from "../white-block";
import { cn } from "@/shared/lib/utils";
import { useEffect, useState } from "react";
import { CheckoutFormValues } from "@/shared/constants";
import { Input } from "../../ui";
import { FormField, FormControl, FormItem, FormMessage } from "../../ui/form";

interface Props {
  className?: string;
}

const formatTime = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const CheckoutTimeSelection = ({ className }: Props) => {
  const { control, setValue, clearErrors } =
    useFormContext<CheckoutFormValues>();
  const [timeOption, setTimeOption] = useState<"asap" | "later">("asap");

  // Використовуємо useEffect для встановлення початкового значення
  useEffect(() => {
    const asapTime = new Date(new Date().getTime() + 60 * 60 * 1000);
    setValue("deliveryTime", `~ ${formatTime(asapTime)} (Якнайшвидше)`, {
      shouldValidate: true,
    });
  }, [setValue]);

  const handleTimeOptionChange = (option: "asap" | "later") => {
    setTimeOption(option);
    clearErrors("deliveryTime"); // Очищуємо помилку при зміні опції
    if (option === "asap") {
      const asapTime = new Date(new Date().getTime() + 60 * 60 * 1000);
      setValue("deliveryTime", `~ ${formatTime(asapTime)} (Якнайшвидше)`, {
        shouldValidate: true,
      });
    } else {
      setValue("deliveryTime", "", { shouldValidate: true });
    }
  };

  return (
    <WhiteBlock title="4. Час доставки" className={cn(className)}>
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleTimeOptionChange("asap")}
            className={cn(
              "py-3 rounded-md text-center transition-colors border text-sm",
              timeOption === "asap"
                ? "bg-black text-white border-black font-semibold"
                : "bg-white hover:bg-gray-50 border-gray-200"
            )}
          >
            Якнайшвидше
          </button>
          <button
            type="button"
            onClick={() => handleTimeOptionChange("later")}
            className={cn(
              "py-3 rounded-md text-center transition-colors border text-sm",
              timeOption === "later"
                ? "bg-black text-white border-black font-semibold"
                : "bg-white hover:bg-gray-50 border-gray-200"
            )}
          >
            На конкретний час
          </button>
        </div>

        {timeOption === "later" && (
          <FormField
            control={control}
            name="deliveryTime"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} type="time" className="text-base" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
    </WhiteBlock>
  );
};
