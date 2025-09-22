"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from "@/shared/components/shared/form";
import { Button } from "@/shared/components/ui";
import toast from "react-hot-toast";
import { updateUserPassword } from "@/app/actions";
import { z } from "zod";
import { changePasswordSchema } from "@/shared/components/shared/modals/auth-modal/forms/schemas";

type ChangePasswordValues = z.infer<typeof changePasswordSchema>;

export const ChangePasswordForm = () => {
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ChangePasswordValues) => {
    try {
      await updateUserPassword(data);
      toast.success("Пароль успішно змінено!");
      form.reset();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Сталася помилка при зміні пароля.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border">
      <h2 className="text-2xl font-bold mb-1">Зміна паролю</h2>
      <p className="text-gray-400 mb-6">
        Встановіть новий пароль для вашого акаунту
      </p>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 max-w-sm"
        >
          <FormInput type="password" name="newPassword" label="Новий пароль" />
          <FormInput
            type="password"
            name="confirmPassword"
            label="Повторіть пароль"
          />
          <Button type="submit" loading={form.formState.isSubmitting}>
            Змінити пароль
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};
