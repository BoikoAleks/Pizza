"use client";

import React, { useEffect, useState } from "react";

type Ingredient = { id: number; name: string; price: number; imageUrl: string };

export const IngredientsManager: React.FC = () => {
  const [items, setItems] = useState<Ingredient[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const fetchIngredients = async () => {
    try {
      const res = await fetch("/api/ingredients");
      setItems(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchIngredients(); }, []);

  const create = async () => {
    await fetch("/api/ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: Number(price) || 0 }),
    });
    setName(""); setPrice("");
    fetchIngredients();
  };

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-2">Інгредієнти</h3>
      <div className="flex gap-2 mb-4">
        <input className="border p-2" placeholder="Назва" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="border p-2 w-28" placeholder="Ціна" value={price} onChange={(e) => setPrice(e.target.value)} />
        <button className="btn-primary" onClick={create}>Додати</button>
      </div>

      <ul className="space-y-2">
        {items.map(i => (
          <li key={i.id} className="flex items-center justify-between border p-2 rounded">
            <div>
              <div className="font-semibold">{i.name}</div>
              <div className="text-sm text-gray-600">{i.price} грн</div>
            </div>
            <div>
              <button className="text-red-600">Видалити</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
