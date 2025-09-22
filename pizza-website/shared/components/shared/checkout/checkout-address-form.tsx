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

interface Props {
  className?: string;
}

export const CheckoutAddressForm: React.FC<Props> = ({ className }) => {
  const { control, watch, setValue } = useFormContext<CheckoutFormValues>();
  const streetAddress = watch("address");
  const [predictions, setPredictions] = useState<SimplifiedNominatimResult[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const fetchPredictions = useCallback(async (value: string) => {
    setLoading(true);
    const result = await autocompleteAddress(value);
    setPredictions(result || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!streetAddress || !streetAddress.trim()) {
      setPredictions([]);
      return;
    }
    const timerId = setTimeout(() => {
      fetchPredictions(streetAddress);
    }, 300);
    return () => clearTimeout(timerId);
  }, [streetAddress, fetchPredictions]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setPredictions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handlePredictionClick = (prediction: SimplifiedNominatimResult) => {
    setValue("address", prediction.display_name, { shouldValidate: true });
    setPredictions([]);
  };

  return (
    <WhiteBlock title="3. Інформація про доставку" className={cn(className)}>
      <div className="flex flex-col gap-5">
        <div className="relative" ref={wrapperRef}>
          <FormField
            control={control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="text-base"
                    placeholder="Введіть назву вулиці, номер будинку..."
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {predictions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1">
              <ul>
                {loading ? (
                  <li className="p-3 text-gray-500">Пошук...</li>
                ) : (
                  predictions.map((prediction) => (
                    <li
                      key={prediction.place_id}
                      onClick={() => handlePredictionClick(prediction)}
                      className="p-3 hover:bg-gray-100 cursor-pointer text-sm"
                    >
                      {prediction.display_name}
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      <FormField
        control={control}
        name="comment"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <FormTextarea
                {...field}
                className="text-base mt-5"
                placeholder="Коментар до замовлення"
                rows={5}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </WhiteBlock>
  );
};
