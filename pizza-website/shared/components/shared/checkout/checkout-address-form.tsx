// ФАЙЛ: /path/to/CheckoutAddressForm.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { WhiteBlock } from "../white-block";
import { Input } from "../../ui";
import { FormTextarea } from "../form";
import {
  autocompleteAddress,
  SimplifiedNominatimResult,
} from "@/shared/lib/openstreetmap";
import { cn } from "@/shared/lib/utils";
import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../../ui/form";
import { CheckoutFormValues } from "@/shared/constants";
import { Loader2, MapPin } from "lucide-react"; // Імпортуємо іконки

interface Props {
  className?: string;
}

export const CheckoutAddressForm: React.FC<Props> = ({ className }) => {
  const { control, watch, setValue, setFocus } =
    useFormContext<CheckoutFormValues>();
  const streetAddress = watch("address");
  const [predictions, setPredictions] = useState<SimplifiedNominatimResult[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Ваша логіка `fetchPredictions`, `useEffect` та `handleClickOutside` залишається без змін
  const fetchPredictions = useCallback(async (value: string) => {
    setLoading(true);
    const result = await autocompleteAddress(value);
    setPredictions(result || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!streetAddress || !streetAddress.trim() || !isFocused) {
      setPredictions([]);
      return;
    }
    const timerId = setTimeout(() => {
      fetchPredictions(streetAddress);
    }, 300);
    return () => clearTimeout(timerId);
  }, [streetAddress, fetchPredictions, isFocused]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setPredictions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handlePredictionClick = (prediction: SimplifiedNominatimResult) => {
    setValue("address", prediction.street || prediction.display_name, {
      shouldValidate: true,
    });

    setValue("houseNumber", prediction.houseNumber ?? "", {
      shouldValidate: true,
    });
    setPredictions([]);
    setTimeout(() => setFocus("apartment"), 100);
  };

  // Використовуємо `watch` для більш реактивної перевірки
  const showHouseApartment =
    !!watch("address") && watch("address").trim().length > 2;

  return (
    <WhiteBlock title="3. Інформація про доставку" className={cn(className)}>
      <div className="flex flex-col gap-4">
        {" "}
        {/* Зменшуємо gap */}
        <div className="relative" ref={wrapperRef}>
          <FormField
            control={control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      {...field}
                      className="text-base pl-10 focus-visible:ring-[var(--ring)]"
                      placeholder="Введіть назву вулиці..."
                      autoComplete="off"
                      onFocus={() => setIsFocused(true)}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Покращений випадаючий список з анімацією та іконками */}
          {predictions.length > 0 && isFocused && (
            <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1 animate-in fade-in-20">
              <ul>
                {loading ? (
                  <li className="p-3 text-gray-500 flex items-center gap-2 bg-white">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Пошук...
                  </li>
                ) : (
                  predictions.map((prediction) => (
                    <li
                      key={prediction.place_id}
                      onClick={() => handlePredictionClick(prediction)}
                      className="p-3 hover:bg-gray-50 cursor-pointer text-sm flex items-start gap-3 bg-white text-gray-900"
                    >
                      <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                      <span>{prediction.display_name}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
        {/* Поля "Будинок" та "Квартира" з анімацією появи */}
        {showHouseApartment && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in-50 slide-in-from-top-2 duration-300">
            <FormField
              control={control}
              name="houseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Номер будинку"
                      className="focus-visible:ring-[var(--ring)]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="apartment"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Квартира / Під'їзд"
                      className="focus-visible:ring-[var(--ring)]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        <FormField
          control={control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FormTextarea
                  {...field}
                  className="text-base  focus-visible:ring-[var(--ring)]"
                  placeholder="Коментар до замовлення (необов'язково)"
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </WhiteBlock>
  );
};
