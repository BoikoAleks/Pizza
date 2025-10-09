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
  { id: 1, name: "Republic cafe", address: "м. Чернівці, вул. Головна, 125" },
  { id: 2, name: "Republic", address: "м. Чернівці, вул. Богдана Хмельницького, 56" },
  { id: 3, name: "Republic", address: "м. Чернівці, просп. Незалежності, 222" },
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
                      "flex-1 p-3 rounded-lg text-center transition-colors border flex items-center justify-center gap-2",
                      deliveryMethod === "delivery"
                        ? "bg-yellow-50 text-black border-yellow-300 font-semibold shadow-sm"
                        : "bg-white hover:bg-gray-50 border-gray-200"
                    )}
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M3 3h10v4H3V3zm0 6h10v8H3V9zm12-1h2l1 3h-3V8z" />
                        </svg>
                        <span className="font-semibold">Доставка</span>
                      </div>
                      <span className="text-sm text-gray-500">Доставка кур'єром — 100 грн</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeliveryMethodChange("pickup")}
                    className={cn(
                      "flex-1 p-3 rounded-lg text-center transition-colors border flex items-center justify-center gap-2",
                      deliveryMethod === "pickup"
                        ? "bg-yellow-50 text-black border-yellow-300 font-semibold shadow-sm"
                        : "bg-white hover:bg-gray-50 border-gray-200"
                    )}
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M5 3a1 1 0 00-1 1v9a3 3 0 003 3h7a3 3 0 003-3V7a1 1 0 00-1-1h-2l-1-2H8L7 3H5z" />
                        </svg>
                        <span className="font-semibold">Самовивіз</span>
                      </div>
                      <span className="text-sm text-gray-500">Забирайте самі — без вартості доставки</span>
                      
                    </div>
                  </button>
                </div>
                {/* Hidden input so the server receives deliveryMethod */}
                <input type="hidden" name="deliveryMethod" value={deliveryMethod} />
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

              
              <CheckoutTimeSelection
                className={loading ? "opacity-40 pointer-events-none" : ""}
              />
            </div>

            {/* Права частина */}
            <div className="w-[450px]">
              <CheckoutSidebar
                totalAmount={totalAmount}
                loading={loading || submitting}
                deliveryMethod={deliveryMethod}
              />
            </div>
          </div>
        </form>
      </FormProvider>
    </Container>
  );
}