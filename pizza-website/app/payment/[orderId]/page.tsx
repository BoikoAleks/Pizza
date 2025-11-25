import { prisma } from "@/prisma/prisma-client";
import PaymentPage from "@/shared/components/shared/payment/page";
import { notFound } from "next/navigation";

type PageProps = {
	params: { orderId: string } | Promise<{ orderId: string }>;
};

export default async function OrderPaymentPage({ params }: PageProps) {
	const resolvedParams = await params;
	const id = Number(resolvedParams.orderId);

	if (!id) {
		notFound();
	}

	const order = await prisma.order.findUnique({ where: { id } });

	if (!order) {
		notFound();
	}

	return <PaymentPage orderId={order.id} amount={order.totalAmount} />;
}
