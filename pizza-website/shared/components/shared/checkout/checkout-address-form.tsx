import React from "react";
import { WhiteBlock } from "../white-block";
import { Input, Textarea } from "../../ui";

export const CheckoutAddressForm: React.FC = () => {
  return (
    <WhiteBlock title="3. Інформація про доставку">
      <div className="flex flex-col gap-5"></div>
      <Input
        name="address"
        className="text-base"
        placeholder="Адреса доставки"
      />
      <Textarea
        className="text-base"
        placeholder="Коментар до замовлення"
        rows={5}
      />
    </WhiteBlock>
  );
};
