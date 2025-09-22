"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { FormInput } from "@/shared/components/shared/form";
import { Button } from "@/shared/components/ui";
import toast from "react-hot-toast";
import { updatePersonalData } from "@/app/actions";
import { z } from "zod";
import { personalDataSchema } from "@/shared/components/shared/modals/auth-modal/forms/schemas";

type PersonalDataValues = z.infer<typeof personalDataSchema>;

interface Props {
  user: User;
}

export const PersonalDataForm: React.FC<Props> = ({ user }) => {
  const form = useForm<PersonalDataValues>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      fullName: user.fullName || "",
    },
  });

  const onSubmit = async (data: PersonalDataValues) => {
    try {
      await updatePersonalData(data);
      toast.success("Дані успішно оновлено!");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Сталася помилка при оновленні даних.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border">
      <h2 className="text-2xl font-bold mb-1">1. Особисті дані</h2>
      <p className="text-gray-400 mb-6">Змінити особисті дані</p>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 max-w-sm"
        >
          <FormInput name="fullName" label="Повне ім'я" />

          <div className="p-4 bg-gray-50 rounded-md text-gray-500 cursor-not-allowed">
            {user.email}
          </div>

          <Button type="submit" loading={form.formState.isSubmitting}>
            Зберегти зміни
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};
