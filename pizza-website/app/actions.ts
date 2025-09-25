'use server';

import { prisma } from '@/prisma/prisma-client';
import { PayOrderTemplate, VerificationUserTemplate } from '@/shared/components/shared/email-templates';


import { CheckoutFormValues } from '@/shared/constants';
import { sendEmail } from '@/shared/lib';
import { getUserSession } from '@/shared/lib/get-user-session';

import { OrderStatus, Prisma } from '@prisma/client';
import { hashSync } from 'bcrypt';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Stripe from 'stripe';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { changePasswordSchema, personalDataSchema } from '@/shared/components/shared/modals/auth-modal/forms/schemas';



export async function createOrder(data: CheckoutFormValues) {
  try {
    const cookieStore = await cookies();
    const cartToken = cookieStore.get('cartToken')?.value;

    if (!cartToken) {
      throw new Error('Cart token not found');
    }

    // === КРОК 1: ОТРИМУЄМО СЕСІЮ ПОТОЧНОГО КОРИСТУВАЧА ===
    const session = await getUserSession();

    // Знаходимо корзину по токену
    const userCart = await prisma.cart.findFirst({
      include: {
        user: true,
        items: {
          include: {
            ingredients: true,
            productItem: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      where: {
        token: cartToken,
      },
    });

    // Якщо корзина не знайдена, повертаємо помилку
    if (!userCart) {
      throw new Error('Cart not found');
    }

    // Якщо корзина пуста, повертаємо помилку
    if (userCart?.totalAmount === 0) {
      throw new Error('Cart is empty');
    }

    // Створюємо замовлення
    const order = await prisma.order.create({
      data: {
        token: cartToken,
        fullName: data.firstName + ' ' + data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        comment: data.comment,
        totalAmount: userCart.totalAmount,
        status: OrderStatus.PENDING,
        items: JSON.stringify(userCart.items),

        // === КРОК 2: ДОДАЄМО ID КОРИСТУВАЧА, ЯКЩО ВІН АВТОРИЗОВАНИЙ ===
        // Це головне виправлення.
        userId: session?.id ? Number(session.id) : undefined,
      },
    });

    // Очищуємо корзину
    await prisma.cart.update({
      where: {
        id: userCart.id,
      },
      data: {
        totalAmount: 0,
      },
    });

    await prisma.cartItem.deleteMany({
      where: {
        cartId: userCart.id,
      },
    });

    const paymentUrl = 'https://payment.url/confirm/'; // Це заглушка, ймовірно ви її заміните

    await sendEmail(
      data.email,
      'Next Pizza / Оплатіть замовлення #' + order.id,
      await PayOrderTemplate({
        orderId: order.id,
        totalAmount: order.totalAmount,
        paymentUrl,
      }),
    );

    return paymentUrl;
  } catch (err) {
    console.log('[CreateOrder] Server error', err);
    // Важливо повертати або обробляти помилку, щоб клієнт знав про неї
    throw new Error('Failed to create order.');
  }
}


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


export async function createCheckoutSession(formData: FormData) {
  const orderId = Number(formData.get('orderId'));

  if (!orderId) {
    throw new Error('Order ID is required');
  }

  // 1. Отримуємо замовлення з нашої бази даних
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  // 2. Створюємо платіжну сесію в Stripe
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'uah',
          product_data: {
            name: `Замовлення #${order.id}`,
            description: `Оплата замовлення в Pizza Republic`,
          },
          // Ціна має бути в копійках!
          unit_amount: order.totalAmount * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    // 3. Вказуємо URL, куди повернути користувача
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
    // 4. Зберігаємо наш ID замовлення, щоб знайти його при webhook
    metadata: {
      orderId: order.id,
    },
  });

  if (!checkoutSession.url) {
    throw new Error('Could not create checkout session');
  }

  // 5. Перенаправляємо користувача на сторінку оплати Stripe
  redirect(checkoutSession.url);
}

export async function updateUserInfo(body: Prisma.UserUpdateInput) {
  try {
    const currentUser = await getUserSession();

    if (!currentUser) {
      throw new Error('Користувач не знайдений');
    }

    const findUser = await prisma.user.findFirst({
      where: {
        id: Number(currentUser.id),
      },
    });

    await prisma.user.update({
      where: {
        id: Number(currentUser.id),
      },
      data: {
        fullName: body.fullName,
        email: body.email,
        password: body.password ? hashSync(body.password as string, 10) : findUser?.password,
      },
    });
  } catch (err) {
    console.log('Error [UPDATE_USER]', err);
    throw err;
  }
}


export async function registerUser(body: Prisma.UserCreateInput) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (user) {
      if (!user.verified) {
        throw new Error('Почта не подтверждена');
      }

      throw new Error('Пользователь уже существует');
    }

    const createdUser = await prisma.user.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        password: hashSync(body.password, 10),
      },
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.verificationCode.create({
      data: {
        code,
        userId: createdUser.id,
      },
    });

    await sendEmail(
      createdUser.email,
      'Next Pizza / 📝 Підтвердження реєстрації',
      await VerificationUserTemplate({
        code,
      }),
    );
  } catch (err) {
    console.log('Error [CREATE_USER]', err);
    throw err;
  }
}

export async function updatePersonalData(
  values: z.infer<typeof personalDataSchema>
) {
  const session = await getUserSession();
  if (!session?.id) {
    throw new Error("Не авторизований");
  }

  try {
    await prisma.user.update({
      where: { id: Number(session.id) },
      data: {
        fullName: values.fullName,
        // Рядок з 'phone' видалено
      },
    });
    revalidatePath("/profile");
  } catch (error) {
    console.error("ERROR [UPDATE_PERSONAL_DATA]:", error);
    throw new Error("Не вдалося оновити дані.");
  }
}

export async function updateUserPassword(
  values: z.infer<typeof changePasswordSchema>
) {
  const session = await getUserSession();
  if (!session?.id) {
    throw new Error("Не авторизований");
  }

  try {
    const hashedPassword = hashSync(values.newPassword, 10);
    await prisma.user.update({
      where: { id: Number(session.id) },
      data: {
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error("ERROR [UPDATE_USER_PASSWORD]:", error);
    throw new Error("Не вдалося оновити пароль.");
  }
}

export async function updateOrderStatus(orderId: number, status: OrderStatus) {
  await checkManagerRole();

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    revalidatePath('/manager');
  } catch (error) {
    console.error('Error [UPDATE_ORDER_STATUS]', error);
    throw Error('Не вдалося оновити статус.');
  }
}


export async function checkManagerRole() {
  const session = await getUserSession();
  if (session?.role !== 'MANAGER' && session?.role !== 'ADMIN') {
    throw new Error('Forbidden: Insufficient permissions');
  }
}


export async function getChatMessages() {
  const session = await getUserSession();
  if (!session?.id) return null;

  const conversation = await prisma.conversation.findUnique({
    where: { userId: Number(session.id) },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return conversation;
}


export async function deleteConversation(conversationId: number) {
  // Перевірка прав доступу
  const session = await getUserSession();
  if (session?.role !== 'MANAGER' && session?.role !== 'ADMIN') {
    throw new Error('Forbidden: Insufficient permissions');
  }

  try {
    // Спочатку видаляємо всі повідомлення, пов'язані з цією розмовою
    await prisma.message.deleteMany({
      where: { conversationId: conversationId },
    });
    
    // Потім видаляємо саму розмову
    await prisma.conversation.delete({
      where: { id: conversationId },
    });

    // Оновлюємо кеш сторінки чатів, щоб список оновився
    revalidatePath('/manager/chat');
  } catch (error) {
    console.error("Error [DELETE_CONSERVATION]", error);
    throw new Error('Не вдалося видалити розмову.');
  }
}



// Позначає розмову як переглянуту менеджером
export async function markConversationAsViewed(conversationId: number) {
  const session = await getUserSession();
  if (session?.role !== 'MANAGER' && session?.role !== 'ADMIN') {
    return;
  }

  try {
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastViewedByManager: new Date() },
    });

    revalidatePath('/manager/chat');
  } catch (error) {
    // Не кидаємо помилку, щоб не зламати рендеринг сторінки
    console.error("Failed to mark conversation as viewed:", error);
  }
}