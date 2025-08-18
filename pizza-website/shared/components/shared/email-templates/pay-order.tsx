import React from "react";

interface Props {
  orderId: number;
  totalAmount: number;
  paymentUrl: string;
}

export const PayOrderTemplate: React.FC<Props> = ({
  orderId,
  totalAmount,
  paymentUrl,
}) => (
  <div>
    <h1>Замовлення #{orderId}</h1>

    <p>
      Оплатіть замовлення на суму <b>{totalAmount} грн</b>. Перейдіть{" "}
      <a href={paymentUrl}>по цьому посиланню</a> для оплати замовлення.
    </p>
  </div>
);
