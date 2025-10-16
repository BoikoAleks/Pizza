"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@prisma/client";
import toast from "react-hot-toast";
import { upsertCategory } from "@/app/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui";
import { Button } from "@/shared/components/ui";
import { categoryFormSchema, CategoryFormValues } from "@/shared/lib/schemas";

interface Props {
  isOpen: boolean;
  categoryToEdit?: Category;
}

const EMPTY_VALUES: CategoryFormValues = { name: "" };

export const CategoryFormModal = ({ isOpen, categoryToEdit }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (isOpen && categoryToEdit) {
      form.reset(categoryToEdit);
    } else if (isOpen) {
      form.reset(EMPTY_VALUES);
    }
  }, [categoryToEdit, isOpen, form]);

  const onSubmit = (data: CategoryFormValues) => {
    startTransition(async () => {
      try {
        const payload = { ...data, id: categoryToEdit?.id };
        await upsertCategory(payload);
        toast.success(
          `Категорію успішно ${categoryToEdit ? "оновлено" : "створено"}!`
        );
        handleClose();
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Сталася помилка.");
        }
      }
    });
  };

  const handleClose = () => router.push("/manager/menu?tab=categories");

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-white shadow-lg">
        <DialogHeader>
          <DialogTitle>
            {categoryToEdit ? "Редагувати категорію" : "Додати нову категорію"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Назва</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Скасувати
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Збереження..." : "Зберегти"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
