export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: { orderId: string } | Promise<{ orderId: string }>;
}) {
  const params = await searchParams;
  const orderId = params?.orderId;

  return (
    <div className="container mx-auto mt-10 text-center">
      <h1 className="text-3xl font-bold text-green-600">
        Оплата пройшла НЕ успішно!
      </h1>
      <p className="mt-4">
        Дякуємо за ваше замовлення #{orderId}.
      </p>
    </div>
  );
}
