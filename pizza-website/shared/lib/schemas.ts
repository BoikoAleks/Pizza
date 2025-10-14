import { z } from 'zod';

export const productFormSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(3, "Назва має бути мінімум 3 символи"),
    imageUrl: z.string().min(1, "Додайте зображення"),
    categoryId: z.coerce.number({ error: 'Оберіть категорію' }),
    items: z.array(z.object({
        id: z.number().optional(),
        price: z.coerce.number({ error: "Вкажіять ціну" }).min(1, "Вкажіть ціну"),
        size: z.union([z.coerce.number(), z.string().refine(s => s === '', { message: "Invalid input" })]).optional().transform(val => (val === '' || val == null ? undefined : Number(val))),
        pizzaType: z.union([z.coerce.number(), z.string().refine(s => s === '', { message: "Invalid input" })]).optional().transform(val => (val === '' || val == null ? undefined : Number(val))),
    })).min(1, "Додайте хоча б один варіант товару"),
    ingredientIds: z.array(z.number()).optional(),
});

export const ingredientFormSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(2, "Назва має бути мінімум 2 символи"),
    price: z.coerce.number({ error: "Вкажіть ціну" }).min(0, "Ціна не може бути від'ємною"),
    imageUrl: z.string().url("Введіть коректний URL зображення"),
});

export const categoryFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Назва має бути мінімум 2 символи"),
});


export type ProductFormValues = z.infer<typeof productFormSchema>;
export type IngredientFormValues = z.infer<typeof ingredientFormSchema>;
export type CategoryFormValues = z.infer<typeof categoryFormSchema>;




