"use client";

import React from "react";
import { Title } from "./title";
import { Input } from "../ui";
import { RangeSlider } from "./range-slider";
import { CheckboxFiltersGroup } from "./checkbox-filters-group";
import { useFilterIngredients } from "@/hooks/useFilterIngredients";
import { useSet } from "react-use";

interface Props {
  className?: string;
}

interface PriceProps {
  priceFrom?: number;
  priceTo?: number;
}

export const Filters: React.FC<Props> = ({ className }) => {
  const { ingredients, loading, onAddId, selectedIngredients: selectedIngredients } = useFilterIngredients();

  const [sizes, { toggle: toggleSizes }] = useSet(new Set<string>([]));
  const [pizzaTypes, { toggle: togglePizzaType }] = useSet(new Set<string>([]));

  const [prices, setPrice] = React.useState<PriceProps>({
    priceFrom: 0,
    priceTo: 400,
  });

  const items = ingredients.map((item) => ({
    value: String(item.id),
    text: item.name,
  }));

  const updatePrice = (name: keyof PriceProps, value: number) => {
    setPrice({
      ...prices,
      [name]: value,
    });
  };

React.useEffect(() => {
  console.log({prices, sizes, pizzaTypes, selectedIngredients});
},[prices, sizes, pizzaTypes,  selectedIngredients]);
    

  return (
    <div className={className}>
      <Title text="Фільтрація" size="sm" className="mb-5 font-bold" />

      {/* Верхні чекбокси */}
      <CheckboxFiltersGroup
        title="Тип бортика"
        name="pizzaType"
        className="mb-5"
        onClickCheckbox={togglePizzaType}
        selected={pizzaTypes}
        items={[
          { value: "1", text: "Сирний" },
          { value: "2", text: "Мисливський" },
          { value: "3", text: "Кунжутний" },
        ]}
      />


      <CheckboxFiltersGroup      
        title="Розмір піци"
        name="sizes"
        className="mb-5"
        onClickCheckbox={toggleSizes}
        selected={sizes}
        items={[
          { value: "20", text: "20 см" },
          { value: "30", text: "30 см" },
          { value: "40", text: "40 см" },
        ]}
      />

      {/* Фільтр цін */}
      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3">Ціна від і до:</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={500}
            value={String(prices.priceFrom)}
            onChange={(e) => updatePrice("priceFrom", Number(e.target.value))}
          />
          <Input
            type="number"
            min={100}
            max={500}
            value={String(prices.priceTo)}
            onChange={(e) => updatePrice("priceTo", Number(e.target.value))}
          />
        </div>
        <RangeSlider
          min={0}
          max={400}
          step={10}
          value={[prices.priceFrom, prices.priceTo]}
          onValueChange={([priceFrom, priceTo]) => {
            setPrice({
              priceFrom,
              priceTo,
            });
          }}
        />
      </div>

      {/* Фільтр інградієнти */}
      <CheckboxFiltersGroup
        title="Інградієнти"
        name="ingredients"
        className="mt-5"
        limit={5}
        defaultItem={items.slice(0, 6)}
        items={items}
        loading={loading}
        onClickCheckbox={onAddId}
        selected={selectedIngredients}
      />
    </div>
  );
};
