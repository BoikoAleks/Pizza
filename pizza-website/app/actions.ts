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
import { pusherServer } from '@/shared/lib/pusher';
import { categoryFormSchema, CategoryFormValues, ingredientFormSchema, IngredientFormValues, productFormSchema, ProductFormValues } from '@/shared/lib/schemas';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';


export async function createOrder(data: CheckoutFormValues) {
  try {
    const cookieStore = await cookies();
    const cartToken = cookieStore.get('cartToken')?.value;

    if (!cartToken) {
      throw new Error('Cart token not found');
    }

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


    const DELIVERY_FEE = 100;
    const isDelivery = data.deliveryMethod === 'delivery';
    const finalTotal = userCart.totalAmount + (isDelivery ? DELIVERY_FEE : 0);


    let deliveryTimestamp: string | undefined = undefined;
    if (data.deliveryTime) {

      const parts = data.deliveryTime.split(':');
      if (parts.length === 2) {
        const now = new Date();
        const target = new Date(now);
        target.setHours(Number(parts[0]));
        target.setMinutes(Number(parts[1]));
        target.setSeconds(0);

        if (target.getTime() <= now.getTime()) {
          target.setDate(target.getDate() + 1);
        }
        deliveryTimestamp = target.toISOString();
      } else {

        deliveryTimestamp = data.deliveryTime;
      }
    }


    const addressParts: string[] = [];
    if (data.address) addressParts.push(String(data.address).trim());
    if (data.houseNumber) addressParts.push(String(data.houseNumber).trim());
    if (data.apartment) addressParts.push(`кв. ${String(data.apartment).trim()}`);
    const fullAddress = addressParts.join(', ');

    // Створюємо замовлення
    const order = await prisma.order.create({
      data: {
        token: cartToken,
        fullName: data.firstName + ' ' + data.lastName,
        email: data.email,
        phone: data.phone,
        address: fullAddress,
        comment: data.comment,
        totalAmount: finalTotal,
        status: OrderStatus.PENDING,
        items: JSON.stringify(userCart.items),
        deliveryTime: deliveryTimestamp ?? undefined,


        userId: session?.id ? Number(session.id) : undefined,
      },
    });


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

    const paymentUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payment/${order.id}`;

    await sendEmail(
      data.email,
      'Next Pizza / Оплатіть замовлення #' + order.id,
      await PayOrderTemplate({
        orderId: order.id,
        totalAmount: order.totalAmount,
        paymentUrl,
      }),
    );


    try {
      const stripeLocal = new Stripe(process.env.STRIPE_SECRET_KEY!);

      const checkoutSession = await stripeLocal.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'uah',
              product_data: {
                name: `Замовлення #${order.id}`,
                description: `Оплата замовлення в Pizza Republic`,
              },
              unit_amount: order.totalAmount * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?paidOrder=${order.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
        metadata: { orderId: order.id },
      });

      if (checkoutSession.url) {
        return checkoutSession.url;
      }
    } catch (err) {
      console.log('[createOrder] Stripe session creation failed', err);

    }

    return paymentUrl;
  } catch (err) {
    console.log('[CreateOrder] Server error', err);

    throw new Error('Failed to create order.');
  }
}


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);


export async function createCheckoutSession(formData: FormData) {
  const orderId = Number(formData.get('orderId'));

  if (!orderId) {
    throw new Error('Order ID is required');
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error('Order not found');
  }

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

          unit_amount: order.totalAmount * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',

    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,

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
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    revalidatePath('/manager');

    try {
      if (updatedOrder.userId) {
        const channelName = `server-to-user-${updatedOrder.userId}`;
        const eventName = 'order-status-updated';

        await pusherServer.trigger(channelName, eventName, {
          orderId: updatedOrder.id,
          status: updatedOrder.status,
        });
      }
    } catch (pusherErr) {
      console.error('Pusher trigger failed [updateOrderStatus]', pusherErr);
    }
  } catch (error) {
    console.error('Error [UPDATE_ORDER_STATUS]', error);
    throw Error('Не вдалося оновити статус.');
  }
}


export async function checkManagerRole() {
  const session = await getUserSession();
  if (session?.role !== 'MANAGER' && session?.role !== 'ADMIN') {
    throw new Error('Forbidden: NOT ENOUGH permissions');
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
  await checkManagerRole();
  const session = await getUserSession();
  if (session?.role !== 'MANAGER' && session?.role !== 'ADMIN') {
    throw new Error('Forbidden: NOT ENOUGHq permissions');
  }

  try {

    await prisma.message.deleteMany({
      where: { conversationId: conversationId },
    });


    await prisma.conversation.delete({
      where: { id: conversationId },
    });

    const channelName = `chat-${conversationId}`;
    const eventName = "conversation-deleted";

    await pusherServer.trigger(channelName, eventName, {
      message: "Цей чат було видалено менеджером.",
    });
    revalidatePath('/manager/chat');
  } catch (error) {
    console.error("Error [DELETE_CONSERVATION]", error);
    throw new Error('Не вдалося видалити розмову.');
  }
}


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

    console.error("Failed to mark conversation as viewed:", error);
  }
}

export async function deleteProduct(productId: number) {
  const session = await getUserSession();
  if (session?.role !== 'MANAGER' && session?.role !== 'ADMIN') {
    throw new Error('Недостатньо прав');
  }
  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        ingredients: {
          set: [],
        },
      },
    });

    await prisma.productItem.deleteMany({
      where: { productId: productId },
    });

    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath('/manager/menu');
  } catch (error) {
    console.error("Error [DELETE_PRODUCT]", error);
    throw new Error('Не вдалося видалити продукт.');
  }
}

export async function upsertIngredient(data: IngredientFormValues) {
  await checkManagerRole();

  const validatedData = ingredientFormSchema.parse(data);
  const { id, ...ingredientData } = validatedData;

  if (id) {
    await prisma.ingredient.update({
      where: { id },
      data: ingredientData,
    });
  } else {
    await prisma.ingredient.create({
      data: ingredientData,
    });
  }

  revalidatePath('/manager/menu');
}

export async function upsertProduct(data: ProductFormValues) {
  await checkManagerRole();

  const validatedData = productFormSchema.parse(data);
  const { id, imageUrl, items, ingredientIds, ...productData } = validatedData;

  let finalImageUrl = imageUrl;

  if (imageUrl?.includes('base64')) {
    const base64Data = imageUrl.split(';base64,').pop();
    if (base64Data) {
      const buffer = Buffer.from(base64Data, 'base64');
      const category = await prisma.category.findUnique({
        where: { id: validatedData.categoryId },
      });
      const categoryName = category?.name.toLowerCase() || 'pizza';
      const imageName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
      const imagePath = path.join(process.cwd(), 'public', 'images', categoryName, imageName);

      const dir = path.dirname(imagePath);
      try {
        await mkdir(dir, { recursive: true });
      } catch (e: unknown) {
        if (e instanceof Error && (e as NodeJS.ErrnoException).code !== 'EEXIST') {
          throw e;
        }
      }

      await writeFile(imagePath, buffer);
      finalImageUrl = `/images/${categoryName}/${imageName}`;
    }
  }

  try {
    if (id) {
      await prisma.$transaction(async (tx) => {
        await tx.product.update({
          where: { id },
          data: {
            ...productData,
            imageUrl: finalImageUrl,
            ingredients: {
              set: ingredientIds?.map((id) => ({ id })),
            },
          },
        });

        await tx.productItem.deleteMany({
          where: { productId: id },
        });

        if (items) {
          await tx.productItem.createMany({
            data: items.map((item) => ({
              ...item,
              productId: id,
            })),
          });
        }
      });
    } else {
      // Create product
      await prisma.product.create({
        data: {
          ...productData,
          imageUrl: finalImageUrl,
          ingredients: {
            connect: ingredientIds?.map((id) => ({ id })),
          },
          items: {
            create: items,
          },
        },
      });
    }
    revalidatePath('/manager/menu');
  } catch (error) {
    console.error('[UPSERT_PRODUCT]', error);
    throw new Error('Не вдалося зберегти продукт.');
  }
}

export async function deleteIngredient(ingredientId: number) {
  await checkManagerRole();

  try {
    await prisma.ingredient.update({
      where: { id: ingredientId },
      data: {
        products: {
          set: [],
        },
      },
    });

    await prisma.ingredient.delete({
      where: { id: ingredientId },
    });

    revalidatePath('/manager/menu');
  } catch (error) {
    console.error("Error [DELETE_INGREDIENT]", error);
    throw new Error('Не вдалося видалити інгредієнт.');
  }
}

export async function upsertCategory(data: CategoryFormValues) {
  await checkManagerRole();

  const validatedData = categoryFormSchema.parse(data);
  const { id, ...categoryData } = validatedData;

  if (id) {
    await prisma.category.update({
      where: { id },
      data: categoryData,
    });
  } else {
    await prisma.category.create({
      data: categoryData,
    });
  }

  revalidatePath('/manager/menu');
}

export async function deleteCategory(categoryId: number) {
  await checkManagerRole();

  // Перевіряємо, чи є продукти в цій категорії
  const productsInCategory = await prisma.product.count({
    where: { categoryId: categoryId },
  });

  if (productsInCategory > 0) {
    throw new Error('Неможливо видалити категорію, оскільки в ній є продукти.');
  }

  try {
    await prisma.category.delete({
      where: { id: categoryId },
    });
    revalidatePath('/manager/menu');
  } catch (error) {
    console.error("Error [DELETE_CATEGORY]", error);
    throw new Error('Не вдалося видалити категорію.');
  }
}