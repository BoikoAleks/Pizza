import React from "react";
import { Title } from "./title";
import { FilterCheckbox } from "./filter-checkbox";
import { Input } from "../ui";
import { RangeSlider } from "./range-slider";
import { CheckboxFiltersGroup } from "./checkbox-filters-group";

interface Props {
  className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <Title text="Фільтрація" size="sm" className="mb-5 font-bold" />

      {/* Верхні чекбокси */}
      <div className="flex flex-col gap-4">
        <FilterCheckbox text="Можна зібрати" value="1" />
        <FilterCheckbox text="Новинки" value="2" />
      </div>

      {/* Фільтр цін */}
      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3">Ціна від і до:</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={500}
            defaultValue={0}
          />
          <Input type="number" min={100} max={500} placeholder="500" />
        </div>
        <RangeSlider min={0} max={500} step={10} value={[0, 500]} />
      </div>

      {/* Фільтр інградієнти */}
      <CheckboxFiltersGroup
        title="Інградієнти"
        className="mt-5"
        limit={5}
        defaultItem={[
          {
            text: "Сирний соус",
            value: "1",
          },
          {
            text: "Моцарела",
            value: "2",
          },
          {
            text: "Часник",
            value: "3",
          },
          {
            text: "Цибуля",
            value: "3",
          },
          {
            text: "Солений огірок",
            value: "4",
          },
          {
            text: "Перець",
            value: "5",
          },
          {
            text: "Помідори",
            value: "6",
          },
        ]}
        items={[
          {
            text: "Сирний соус",
            value: "1",
          },
          {
            text: "Моцарела",
            value: "2",
          },
          {
            text: "Часник",
            value: "3",
          },
          {
            text: "Цибуля",
            value: "3",
          },
          {
            text: "Солений огірок",
            value: "4",
          },
          {
            text: "Перець",
            value: "5",
          },
          {
            text: "Помідори",
            value: "6",
          },
        ]}
      />
    </div>
  );
};
