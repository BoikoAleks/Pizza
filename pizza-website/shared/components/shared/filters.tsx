"use client";

import React from "react";
import { Title } from "./title";
import { Input } from "../ui";
import { RangeSlider } from "./range-slider";
import { CheckboxFiltersGroup } from "./checkbox-filters-group";
import { useQueryFilters, useFilters, useIngredients } from "@/shared/hooks";

interface Props {
  className?: string;
}
export const Filters: React.FC<Props> = ({ className }) => {
  const { ingredients, loading } = useIngredients();
  const filters = useFilters();

  useQueryFilters(filters);

  // Стан для ціни
  // Масив для чекбоксів інгредієнтів
  const items = ingredients.map((item) => ({
    value: String(item.id),
    text: item.name,
  }));

  const updatePrices = (prices: number[]) => {
    filters.setPrices("priceFrom", prices[0]);
    filters.setPrices("priceTo", prices[1]);
  };

  return (
    <div className={className}>
      <Title text="Фільтрація" size="sm" className="mb-5 font-bold" />

      {/* Чекбокси для типу бортика */}
      <CheckboxFiltersGroup
        title="Тип бортика"
        name="pizzaType"
        className="mb-5"
        onClickCheckbox={filters.setPizzaTypes}
        selected={filters.pizzaTypes}
        items={[
          { value: "1", text: "Сирний" },
          { value: "2", text: "Мисливський" },
          { value: "3", text: "Кунжутний" },
        ]}
        limit={0}
      />

      {/* Чекбокси для розміру піци */}
      <CheckboxFiltersGroup
        title="Розмір піци"
        name="sizes"
        className="mb-5"
        onClickCheckbox={filters.setSizes}
        selected={filters.sizes}
        items={[
          { value: "20", text: "20 см" },
          { value: "30", text: "30 см" },
          { value: "40", text: "40 см" },
        ]}
        limit={0}
      />

      {/* Фільтр цін (інпути + слайдер) */}
      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3">Ціна від і до:</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={400}
            value={String(filters.prices.priceFrom)}
            onChange={(e) =>
              filters.setPrices("priceFrom", Number(e.target.value))
            }
          />
          <Input
            type="number"
            min={100}
            max={400}
            placeholder="400"
            value={String(filters.prices.priceTo)}
            onChange={(e) =>
              filters.setPrices("priceTo", Number(e.target.value))
            }
          />
        </div>
        <RangeSlider
          min={0}
          max={400}
          step={10}
          value={[
            filters.prices.priceFrom || 0,
            filters.prices.priceTo || 400,
          ]}
          onValueChange={updatePrices}
        />
      </div>

      {/* Фільтр інгредієнтів (чекбокси, можна обрати до 5) */}
      <CheckboxFiltersGroup
        title="Інградієнти"
        name="ingredients"
        className="mt-5"
        limit={5}
        defaultItem={items.slice(0, 5)}
        items={items}
        loading={loading}
        onClickCheckbox={filters.setSelectedIngredients}
        selected={filters.selectedIngredients}
      />
    </div>
  );
};
