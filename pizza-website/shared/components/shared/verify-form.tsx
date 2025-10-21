"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/shared/components/ui";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui";
import { toast } from "react-hot-toast";
import { verifyEmail } from "@/app/actions";
import { useRouter } from "next/navigation";

const verifySchema = z.object({
  code: z.string().length(6, "Код має складатися з 6 цифр"),
});

export const VerifyForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = (data: z.infer<typeof verifySchema>) => {
    startTransition(async () => {
      try {
        await verifyEmail(data.code);
        toast.success("Пошту успішно підтверджено!");
        router.push("/");
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Код підтвердження</FormLabel>
              <FormControl>
                <Input placeholder="123456" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Перевірка..." : "Підтвердити"}
        </Button>
      </form>
    </Form>
  );
};
