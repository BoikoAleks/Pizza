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
import { changePasswordSchema, personalDataSchema, productFormSchema, ProductFormValues } from '@/shared/components/shared/modals/auth-modal/forms/schemas';



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
  const session = await getUserSession();

  if (session?.role !== 'MANAGER' && session?.role !== 'ADMIN') {
    throw new Error('Недостатньо прав');
  }

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    revalidatePath('/manager');
  } catch (error) {
    console.error('Error [UPDATE_ORDER_STATUS]', error);
    throw new Error('Не вдалося оновити статус.');
  }
}

async function checkManagerRole() {
  const session = await getUserSession();
  if (session?.role !== 'MANAGER' && session?.role !== 'ADMIN') {
    throw new Error('Недостатньо прав');
  }
}
export async function upsertProduct(data: ProductFormValues) {
  await checkManagerRole();

  // Валідуємо дані на сервері
  const validatedData = productFormSchema.parse(data);
  const { id: productId, items, ingredientIds, ...productData } = validatedData;

  const productPayload = {
    ...productData,
    ingredients: {
      set: ingredientIds?.map(id => ({ id })) || [],
    },
  };

  if (productId) {
    // --- ОНОВЛЕННЯ ІСНУЮЧОГО ПРОДУКТУ ---
    await prisma.product.update({
      where: { id: productId },
      data: {
        ...productPayload,
        items: {
          deleteMany: {}, // Спочатку видаляємо старі варіанти
          create: items.map(({ price, size, pizzaType }) => ({ // Потім створюємо нові
            price,
            size,
            pizzaType,
          })),
        },
      },
    });
  } else {
    // --- СТВОРЕННЯ НОВОГО ПРОДУКТУ ---
    await prisma.product.create({
      data: {
        ...productPayload,
        items: {
          create: items.map(({ price, size, pizzaType }) => ({
            price,
            size,
            pizzaType,
          })),
        },
      },
    });
  }

  // Оновлюємо кеш, щоб побачити зміни одразу
  revalidatePath('/manager/menu');
}


// --- ФУНКЦІЯ ДЛЯ ВИДАЛЕННЯ ПРОДУКТУ ---
export async function deleteProduct(productId: number) {
  await checkManagerRole();

  // Видаляємо продукт. Prisma автоматично видалить пов'язані ProductItem
  await prisma.product.delete({
    where: { id: productId },
  });

  revalidatePath('/manager/menu');
}