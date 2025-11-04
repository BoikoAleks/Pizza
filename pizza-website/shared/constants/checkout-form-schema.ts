import { z } from 'zod';

const normalizePhoneDigits = (value: string) => value.replace(/\D/g, '');

const isValidUkrainianPhone = (digits: string) => {
    if (digits.length === 12 && digits.startsWith('380')) {
        return true;
    }

    if (digits.length === 10 && digits.startsWith('0')) {
        return true;
    }

    return false;
};

export const checkoutFormSchema = z.object({
    firstName: z.string().min(2, { message: "Ім`я повинно мати не менше 2-х символів" }),
    lastName: z.string().min(2, { message: 'Прізвище повинно мати не менше 2-х символів' }),
    email: z.string().email({ message: 'Введіть корректну електронну пошту' }),
    phone: z
        .string()
        .trim()
        .refine((value) => isValidUkrainianPhone(normalizePhoneDigits(value)), {
            message: 'Введіть номер у форматі +380 XX XXX XX XX',
        })
        .transform((value) => {
            const digits = normalizePhoneDigits(value);

            if (!digits) {
                return value.trim();
            }

            if (digits.startsWith('380') && digits.length === 12) {
                return `+${digits}`;
            }

            if (digits.startsWith('0') && digits.length === 10) {
                return `+38${digits}`;
            }

            return value.trim();
        }),
    address: z.string().min(5),
    houseNumber: z.string().optional(),
    apartment: z.string().optional(),
    comment: z.string().optional(),
    deliveryTime: z.string().min(1, { message: "Оберіть час доставки" }),
    deliveryMethod: z.enum(['delivery', 'pickup']).optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>; 