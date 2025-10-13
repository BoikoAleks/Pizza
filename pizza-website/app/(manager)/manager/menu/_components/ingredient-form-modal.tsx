"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ingredient } from "@prisma/client";
import toast from "react-hot-toast";

import { upsertIngredient } from "@/app/actions";


import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui";
import { Button } from "@/shared/components/ui";
import { ingredientFormSchema, IngredientFormValues } from "@/shared/lib/schemas";

interface Props {
  isOpen: boolean;
  ingredientToEdit?: Ingredient;
}

const EMPTY_VALUES: IngredientFormValues = { name: "", price: 0, imageUrl: "" };

export const IngredientFormModal = ({ isOpen, ingredientToEdit }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<IngredientFormValues>({
    resolver: zodResolver(ingredientFormSchema) as any,
    defaultValues: EMPTY_VALUES,
  });

  useEffect(() => {
    if (isOpen && ingredientToEdit) {
      form.reset(ingredientToEdit);
    } else if (isOpen) {
      form.reset(EMPTY_VALUES);
    }
  }, [ingredientToEdit, isOpen, form]);
  
  const onSubmit = (data: IngredientFormValues) => {
    startTransition(async () => {
      try {
        const payload = { ...data, id: ingredientToEdit?.id };
        await upsertIngredient(payload);
        toast.success(`Інгредієнт успішно ${ingredientToEdit ? 'оновлено' : 'створено'}!`);
        handleClose();
      } catch (error) {
        toast.error("Сталася помилка.");
      }
    });
  };

  const handleClose = () => router.push('/manager/menu?tab=ingredients');

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-white shadow-lg">
        <DialogHeader>
          <DialogTitle>{ingredientToEdit ? "Редагувати інгредієнт" : "Додати новий інгредієнт"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField name="name" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Назва</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="price" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>Ціна</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField name="imageUrl" control={form.control} render={({ field }) => (
              <FormItem><FormLabel>URL зображення</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>Скасувати</Button>
              <Button type="submit" disabled={isPending}>{isPending ? "Збереження..." : "Зберегти"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};