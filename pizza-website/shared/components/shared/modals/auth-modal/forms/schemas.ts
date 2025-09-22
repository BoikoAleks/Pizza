// FILE: /path/to/your/schemas.ts (ваш існуючий файл)

import { z } from 'zod';

// --- ІСНУЮЧІ СХЕМИ ДЛЯ ЛОГІНУ ТА РЕЄСТРАЦІЇ ---

export const passwordSchema = z.string().min(4, { message: 'Введіть коректний пароль' });

export const formLoginSchema = z.object({
  email: z.string().email({ message: 'Введіть коректну пошту' }),
  password: passwordSchema,
});

export const formRegisterSchema = formLoginSchema
  .merge(
    z.object({
      fullName: z.string().min(2, { message: 'Введіть імʼя та прізвище' }),
      confirmPassword: passwordSchema,
    }),
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Паролі не співпадають',
    path: ['confirmPassword'],
  });

export type TFormLoginValues = z.infer<typeof formLoginSchema>;
export type TFormRegisterValues = z.infer<typeof formRegisterSchema>;


// --- ДОДАЙТЕ НОВИЙ КОД НИЖЧЕ ---

// --- СХЕМИ ДЛЯ СТОРІНКИ ПРОФІЛЮ ---

export const personalDataSchema = z.object({
  fullName: z.string().min(2, "Введіть повне ім'я"),
});

export const changePasswordSchema = z
  .object({
    newPassword: z.string().min(4, "Пароль має бути мінімум 4 символи"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Паролі не співпадають",
    path: ["confirmPassword"],
  });

// Опціонально: додайте типи для нових схем
export type PersonalDataValues = z.infer<typeof personalDataSchema>;
export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;


export const productFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, "Назва має бути мінімум 3 символи"),
  imageUrl: z.string().url("Введіть коректний URL зображення"),
  categoryId: z.coerce.number({ error: 'Оберіть категорію' }),
  items: z.array(z.object({
    id: z.number().optional(),
    price: z.coerce.number({ error: "Вкажіть ціну" }).min(1, "Вкажіть ціну"),
    
    
    size: z.union([z.coerce.number(), z.null()]).optional().transform(val => val ?? undefined),
    pizzaType: z.union([z.coerce.number(), z.null()]).optional().transform(val => val ?? undefined),

  })).min(1, "Додайте хоча б один варіант товару"),
  ingredientIds: z.array(z.number()).optional(),
});
export type ProductFormValues = z.infer<typeof productFormSchema>;