import {
  CheckoutItem,
  CheckoutItemDetails,
  Container,
  Title,
  WhiteBlock,
} from "@/shared/components/shared";
import { Button, Input, Textarea } from "@/shared/components/ui";
import { ArrowRight, Package, Truck } from "lucide-react";

export default function CheckoutPage() {
  return (
    <Container className="mt-6">
      <Title
        text="Оформлення замовлення"
        className="font-extrabold mb-8 text-[36px]"
      />

      <div className="flex gap-10">
        {/* Ліва частина */}
        <div className="flex flex-col gap-10 flex-1 mb-20">
          <WhiteBlock title="1. Корзина">
            <CheckoutItem
              id={1}
              imageUrl="/images/pizza/caprese.webp"
              details="Вітчанка"
              name="Вітчанкаwwwwwwwww"
              price={123}
              quantity={1}
            />
          </WhiteBlock>

          <WhiteBlock title="2. Персональні дані">
            <div className="grid grid-cols-2 gap-5">
              <Input
                name="firstName"
                className="text-base"
                placeholder="Ім'я"
              />
              <Input
                name="lastName"
                className="text-base"
                placeholder="Прізвище"
              />
              <Input name="email" className="text-base" placeholder="E-mail" />
              <Input name="phone" className="text-base" placeholder="Телефон" />
            </div>
          </WhiteBlock>
          <div>
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
          </div>
        </div>

        {/* Права частина */}
        <div className="w-[450px]">
          <WhiteBlock className="p-6 sticky top-4">
            <div className="flex flex-col gap-1">
              <span className="text-xl"> Загальна сума: </span>
              <span className="text-[34px] font-bold">150 грн</span>
            </div>

            <CheckoutItemDetails
              title={
                <div className="flex items-center ">
                  <Package size={18} className="mr-2 text-gray-400" />
                  Сума замовлення:
                </div>
              }
              value="150 грн"
            />
            <CheckoutItemDetails
              title={
                <div className="flex items-center ">
                  <Truck size={18} className="mr-2 text-gray-400" />
                  Вартість доставки:
                </div>
              }
              value="150 грн"
            />

            <Button
              type="submit"
              className="w-full h-14 rounded-2xl mt-6 text-base font-bold"
            >
              Оформити замовлення
              <ArrowRight className="w-5 ml-2" />
            </Button>
          </WhiteBlock>
        </div>
      </div>
    </Container>
  );
}
