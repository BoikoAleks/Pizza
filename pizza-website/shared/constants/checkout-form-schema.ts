import { z } from 'zod';

export const checkoutFormSchema = z.object({
    firstName: z.string().min(2, { message: "Ім`я повинно мати не менше 2-х символів" }),
    lastName: z.string().min(2, { message:'Прізвище повинно мати не менше 2-х символів' }),
    email: z.string().email({ message: 'Введіть корректну електронну пошту' }),
    phone: z.string().min(10, { message: 'Введіть корректний номер телефону' }),
    address: z.string().min(5,),
    houseNumber: z.string().optional(),
    apartment: z.string().optional(),
    comment: z.string().optional(),
    deliveryTime: z.string().min(1),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>; 