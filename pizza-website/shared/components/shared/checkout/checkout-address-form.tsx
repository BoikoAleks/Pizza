// shared/components/shared/checkout/checkout-address-form.tsx

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { WhiteBlock } from "../white-block";
import { Input } from "../../ui";
import { FormTextarea } from "../form";
import { autocomplete } from "@/shared/lib/google";

// !!! ОСЬ ТУТ ФІНАЛЬНА ЗМІНА !!!
// Використовуємо правильний тип, який повертає placeAutocomplete
import type { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";

export const CheckoutAddressForm: React.FC = () => {
  // 1. СТАН КОМПОНЕНТА
  const [address, setAddress] = useState("");
  // Тепер використовуємо ПРАВИЛЬНИЙ тип
  const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([]);
  const [loading, setLoading] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // 2. ЛОГІКА API З DEBOUNCING
  const fetchPredictions = useCallback(async (value: string) => {
    setLoading(true);
    const result = await autocomplete(value);
    setPredictions(result || []); // Цей result і є PlaceAutocompleteResult[]
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!address.trim()) {
      setPredictions([]);
      return;
    }
    const timerId = setTimeout(() => {
      fetchPredictions(address);
    }, 300);
    return () => {
      clearTimeout(timerId);
    };
  }, [address, fetchPredictions]);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setPredictions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  // 3. ОБРОБНИКИ ПОДІЙ
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handlePredictionClick = (prediction: PlaceAutocompleteResult) => {
    setAddress(prediction.description);
    setPredictions([]);
  };

  return (
    <WhiteBlock title="3. Інформація про доставку">
      <div className="flex flex-col gap-5 relative" ref={wrapperRef}>
        <Input
          name="address"
          className="text-base"
          placeholder="Адреса доставки"
          value={address}
          onChange={handleAddressChange}
          autoComplete="off"
        />

        {/* 4. ВІДОБРАЖЕННЯ ПІДКАЗОК */}
        {predictions.length > 0 && (
          <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1">
            <ul>
              {loading ? (
                <li className="p-3 text-gray-500">Завантаження...</li>
              ) : (
                predictions.map((prediction) => (
                  <li
                    key={prediction.place_id}
                    onClick={() => handlePredictionClick(prediction)}
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                  >
                    {prediction.description}
                  </li>
                ))
              )}
            </ul>
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