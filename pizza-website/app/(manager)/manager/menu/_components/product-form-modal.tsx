// ФАЙЛ: app/manager/menu/_components/product-form-modal.tsx
"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Ingredient, Product, ProductItem } from "@prisma/client";
import toast from "react-hot-toast";

import { upsertProduct } from "@/app/actions";


import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui";
import { Button } from "@/shared/components/ui";
import { PlusCircle, Trash2 } from "lucide-react";
import { productFormSchema, ProductFormValues } from "@/shared/components/shared/modals/auth-modal/forms/schemas";

type ProductToEdit = (Product & { items: ProductItem[]; ingredients: { id: number }[] }) | undefined;

interface Props {
  isOpen: boolean;
  categories: Category[];
  productToEdit?: ProductToEdit;
  ingredients: Ingredient[];
}

const EMPTY_VALUES: ProductFormValues = {
  name: "",
  imageUrl: "",
  categoryId: 0,
  items: [{ price: 0, size: undefined, pizzaType: undefined }],
  ingredientIds: [],
};

export const ProductFormModal = ({ isOpen, categories, productToEdit, ingredients }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: EMPTY_VALUES,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    if (productToEdit) {
      form.reset({
        name: productToEdit.name,
        imageUrl: productToGitHucom/next-auth/`authOptions`..imageUrl,
        categoryId: productToEdit.categoryId,
        items: productToEdit.items.length ? productToEdit.items : [{ price: 0 }],
        ingredientIds: productToEdit.ingredients.map(ing => ing.id),
      });
    } else {
      form.reset(EMPTY_VALUES);
    }
  }, [productToEdit, isOpen, form]);
  
  const onSubmit = (data: ProductFormValues) => {
    startTransition(async () => {
      try {
        const payload = { ...data, id: productToEdit?.id };
        await upsertProduct(payload);
        toast.success(`Продукт успішно ${productToEdit ? 'оновлено' : 'створено'}!`);
        handleClose();
      } catch (error) {
        toast.error("Сталася помилка. Спробуйте ще раз.");
      }
    });
  };

  const handleClose = () => router.push('/manager/menu');

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white shadow-lg dark:bg-gray-800">
        <DialogHeader><DialogTitle>{productToEdit ? "Редагувати продукт" : "Додати новий продукт"}</DialogTitle></DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <FormField name="name" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Назва</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="imageUrl" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>URL зображення</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="categoryId" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Категорія</FormLabel>
                  <Select onValueChange={field.onChange} value={String(field.value || '')}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Оберіть категорію" /></SelectTrigger></FormControl>
                    <SelectContent>{categories.map(cat => <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>)}</SelectContent>
                  </Select>
                <FormMessage /></FormItem>
              )} />
            </div>

            <div>
              <FormLabel>Варіанти товару</FormLabel>
              <div className="space-y-4 mt-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-4 p-4 border rounded-md">
                    <FormField name={`items.${index}.price`} control={form.control} render={({ field }) => (
                      <FormItem className="flex-1"><FormControl><Input {...field} type="number" placeholder="Ціна" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField name={`items.${index}.size`} control={form.control} render={({ field }) => (
                      <FormItem className="flex-1"><FormControl><Input {...field} type="number" placeholder="Розмір (напр., 30)" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField name={`items.${index}.pizzaType`} control={form.control} render={({ field }) => (
                      <FormItem className="flex-1"><FormControl><Input {...field} type="number" placeholder="Тип бортика (напр., 1)" /></FormControl><FormMessage /></FormItem>
                    )} />
                    {fields.length > 1 && <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}><Trash2 size={16} /></Button>}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => append({ price: 0 })}>
                  <PlusCircle size={16} className="mr-2" /> Додати варіант
                </Button>
              </div>
            </div>

            <FormField name="ingredientIds" control={form.control} render={() => (
              <FormItem><FormLabel>Доступні інгредієнти</FormLabel>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 p-4 border rounded-md">
                  {ingredients.map(ing => (
                    <FormField key={ing.id} name="ingredientIds" control={form.control} render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl><Checkbox checked={field.value?.includes(ing.id)} onCheckedChange={(checked) => {
                          const currentValue = field.value || [];
                          return checked ? field.onChange([...currentValue, ing.id]) : field.onChange(currentValue.filter(id => id !== ing.id));
                        }} /></FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">{ing.name}</FormLabel>
                      </FormItem>
                    )} />
                  ))}
                </div>
              </FormItem>
            )} />

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleClose}>Скасувати</Button>
              <Button type="submit" disabled={isPending}>{isPending ? "Збереження..." : "Зберегти"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};