import React from 'react';
import { FilterCheckbox, FilterChecboxProps } from './filter-checkbox';
import { Input } from '../ui/input';

type Item = FilterChecboxProps;

interface Props {
  title: string;
  items: Item[];
  defaultItems?: Item[];
  limit?: number;
  searchInputPlaceholder?: string;
  className?: string;
  onChange?: (values: string[]) => void;
  defaultValue?: string[];
}

export const CheckboxFiltersGroup: React.FC<Props> = (className) => {
  title,
  items,
  defaultItems,
  limit = 5,
  searchInputPlaceholder = 'Пошук...',
  className,
  onChange,
  defaultValue,
} => {
    return <div className={className}>
        <p className="font-bold mb-3">{title}</p>
        <div className="mb-5">
          <Input placeholder={searchInputPlaceholder} className="bg-gray-50 border-none" />
        </div>

      <div className="flex flex-col gap-4 max-h-96 pr-2 overflow-auto scrollbar">
        {items.map((item, index) => (
          <FilterCheckbox
            key={index}
            value={item.value}
            text={item.text}
            endAdornment={item.endAdornment}
            checked={false}
            onCheckedChange={(ids) => console.log(ids)}
          />
        ))}
      </div>
    </div>
  );
};