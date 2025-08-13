"use client";

import { CheckoutSidebar, Container, Title } from "@/shared/components/shared";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "@/shared/hooks";
import {
  CheckoutAddressForm,
  CheckoutCart,
  CheckoutPersonalForm,
} from "@/shared/components/shared/checkout";
import { checkoutFormSchema, CheckoutFormValues } from "@/shared/constants";

export default function CheckoutPage() {
  const { totalAmount, items, updateItemQuantity, removeCartItem } = useCart();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      comment: "",
    },
  });

  const onSubmit = (data: CheckoutFormValues) => {
    console.log(data);
  };

  const onClickCountButton = (
    id: number,
    quantity: number,
    type: "plus" | "minus"
  ) => {
    const newQuantity = type === "plus" ? quantity + 1 : quantity - 1;
    updateItemQuantity(id, newQuantity);
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
              />
              {/* Персональні дані */}
              <CheckoutPersonalForm />
              
              {/* Адреса */}
              <CheckoutAddressForm />
            </div>

            {/* Права частина */}
            <div className="w-[450px]">
              <CheckoutSidebar totalAmount={totalAmount} />
            </div>
          </div>
        </form>
      </FormProvider>
    </Container>
  );
}
