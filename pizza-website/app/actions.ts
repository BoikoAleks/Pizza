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

export async function createOrder(data: CheckoutFormValues) {
  try {
    const cookieStore = await cookies();
    const cartToken = cookieStore.get('cartToken')?.value;

    if (!cartToken) {
      throw new Error('Cart token not found');
    }

    /* Находим корзину по токену */
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

    /* Если корзина не найдена возращаем ошибку */
    if (!userCart) {
      throw new Error('Cart not found');
    }

    /* Если корзина пустая возращаем ошибку */
    if (userCart?.totalAmount === 0) {
      throw new Error('Cart is empty');
    }

    /* Создаем заказ */
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
      },
    });

    /* Очищаем корзину */
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



    const paymentUrl = 'https://payment.url/confirm/';

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