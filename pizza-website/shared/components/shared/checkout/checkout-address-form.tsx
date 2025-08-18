"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { WhiteBlock } from "../white-block";
import { Input } from "../../ui";
import { FormTextarea } from "../form";
import {
  autocompleteAddress,
  SimplifiedNominatimResult,
} from "@/shared/lib/openstreetmap";

// 1. ІМПОРТУЄМО УТИЛІТУ `cn` для об'єднання класів
import { cn } from "@/shared/lib/utils";

interface Props {
  className?: string;
}
export const CheckoutAddressForm: React.FC<Props> = ({ className }) => {
  const [address, setAddress] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [apartment, setApartment] = useState("");
  const [isAddressSelected, setIsAddressSelected] = useState(false);
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
    if (!address.trim() || isAddressSelected) {
      setPredictions([]);
      return;
    }
    const timerId = setTimeout(() => {
      fetchPredictions(address);
    }, 300);
    return () => clearTimeout(timerId);
  }, [address, fetchPredictions, isAddressSelected]);

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

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    setIsAddressSelected(false);
    setHouseNumber("");
    setApartment("");
  };

  const handlePredictionClick = (prediction: SimplifiedNominatimResult) => {
    setAddress(prediction.display_name);
    setPredictions([]);
    setIsAddressSelected(true);
  };

  return (
    // 2. ПЕРЕДАЄМО `className` В КОРЕНЕВИЙ КОМПОНЕНТ `WhiteBlock`
    <WhiteBlock title="3. Інформація про доставку" className={cn(className)}>
      <div className="flex flex-col gap-5">
        <div className="relative" ref={wrapperRef}>
          <Input
            name="address"
            className="text-base"
            placeholder="Введіть назву вулиці..."
            value={address}
            onChange={handleAddressChange}
            autoComplete="off"
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

        {isAddressSelected && (
          <div className="grid grid-cols-2 gap-5">
            <Input
              name="houseNumber"
              className="text-base"
              placeholder="Номер будинку"
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
            />
            <Input
              name="apartment"
              className="text-base"
              placeholder="Квартира (необов'язково)"
              value={apartment}
              onChange={(e) => setApartment(e.target.value)}
            />
          </div>
        )}
      </div>

      <FormTextarea
        name="comment"
        className="text-base mt-5"
        placeholder="Коментар до замовлення"
        rows={5}
      />
    </WhiteBlock>
  );
};