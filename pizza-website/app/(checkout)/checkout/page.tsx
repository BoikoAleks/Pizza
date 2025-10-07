"use client";

import { CheckoutSidebar, Container, Title } from "@/shared/components/shared";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "@/shared/hooks";
import {
  CheckoutAddressForm,
  CheckoutCart,
  CheckoutPersonalForm,
  CheckoutPickup,
} from "@/shared/components/shared/checkout";

import { checkoutFormSchema, CheckoutFormValues } from "@/shared/constants";
import { createOrder } from "@/app/actions";
import { ErrorIcon, toast } from "react-hot-toast";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import React from "react";
import { Api } from "@/shared/services/api-client";
import { cn } from "@/shared/lib/utils";
import { CheckoutTimeSelection } from "@/shared/components/shared/checkout/checkout-time-selection";

const PICKUP_POINTS = [
  { id: 1, name: "Наше кафе на Хрещатику", address: "м. Київ, вул. Хрещатик, 1" },
  { id: 2, name: "Кав'ярня 'Затишок'", address: "м. Київ, вул. Велика Васильківська, 5" },
  { id: 3, name: "Пункт видачі 'Швидко'", address: "м. Київ, просп. Перемоги, 22" },
];

export default function CheckoutPage() {
  const [submitting, setSubmitting] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">(
    "delivery"
  );
  const { totalAmount, items, updateItemQuantity, removeCartItem, loading } =
    useCart();
  const { data: session } = useSession();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      houseNumber: "",
      apartment: "",
      comment: "",
      deliveryTime: "", 
    },
  });

  React.useEffect(() => {
    async function fetchUserInfo() {
      const data = await Api.auth.getMe();
      const [firstName, lastName] = data.fullName.split(' ');
      form.setValue('firstName', firstName);
      form.setValue('lastName', lastName);
      form.setValue('email', data.email);
    }
    if (session) {
      fetchUserInfo();
    }
  }, [session, form]);

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      setSubmitting(true);
      const url = await createOrder(data);

      toast.success("Замовлення успішно створено! Перехід до оплати", {
        icon: <CheckIcon />,
      });

      if (url) {
        location.href = url;
      }
    } catch (err) {
      console.log(err);
      setSubmitting(false);
      toast.error("Не вдалось створити замовлення", {
        icon: <ErrorIcon />,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const onClickCountButton = (
    id: number,
    quantity: number,
    type: "plus" | "minus"
  ) => {
    const newQuantity = type === "plus" ? quantity + 1 : quantity - 1;
    updateItemQuantity(id, newQuantity);
  };

  const handleDeliveryMethodChange = (method: "delivery" | "pickup") => {
    setDeliveryMethod(method);
    form.setValue("address", "", { shouldValidate: true });
  };

  return (
    <Container className="mt-6">
      <Title
        text="Оформлення замовлення"
        className="font-extrabold mb-8 text-[36px]"
      />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-10">
            {/* Ліва частина */}
            <div className="flex flex-col gap-10 flex-1 mb-20">
              <CheckoutCart
                onClickCountButton={onClickCountButton}
                removeCartItem={removeCartItem}
                items={items}
                loading={loading}
              />
              <CheckoutPersonalForm
                className={loading ? "opacity-40 pointer-events-none" : ""}
              />

              {/* ОНОВЛЕНИЙ БЛОК: Вибір способу доставки */}
              <div className={`bg-white rounded-xl p-6 shadow-sm ${loading ? "opacity-40 pointer-events-none" : ""}`}>
                <h2 className="text-2xl font-bold mb-6">2. Спосіб доставки</h2>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleDeliveryMethodChange("delivery")}
                    className={cn(
                      "flex-1 p-3 rounded-lg text-center transition-colors border",
                      deliveryMethod === "delivery"
                        ? "bg-black text-white border-black font-semibold"
                        : "bg-white hover:bg-gray-50 border-gray-200"
                    )}
                  >
                    Доставка
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeliveryMethodChange("pickup")}
                    className={cn(
                      "flex-1 p-3 rounded-lg text-center transition-colors border",
                      deliveryMethod === "pickup"
                        ? "bg-black text-white border-black font-semibold"
                        : "bg-white hover:bg-gray-50 border-gray-200"
                    )}
                  >
                    Самовивіз
                  </button>
                </div>
              </div>

              {/* Умовний рендеринг форми адреси або точок самовивозу */}
              {deliveryMethod === "delivery" ? (
                <CheckoutAddressForm
                  className={loading ? "opacity-40 pointer-events-none" : ""}
                />
              ) : (
                <CheckoutPickup
                  points={PICKUP_POINTS}
                  className={loading ? "opacity-40 pointer-events-none" : ""}
                />
              )}

              {/* НОВИЙ КОМПОНЕНТ: Вибір часу */}
              <CheckoutTimeSelection
                className={loading ? "opacity-40 pointer-events-none" : ""}
              />
            </div>

            {/* Права частина */}
            <div className="w-[450px]">
              <CheckoutSidebar
                totalAmount={totalAmount}
                loading={loading || submitting}
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </Container>
  );
}