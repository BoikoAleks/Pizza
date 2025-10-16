"use client";

import { ChangeEvent, useRef } from "react";
import { Button } from "@/shared/components/ui";
import { Input } from "@/shared/components/ui";
import { cn } from "@/shared/lib/utils";
import Image from "next/image";

interface Props {
  onUpload: (url: string) => void;
  className?: string;
  defaultValue?: string;
}

export const UploadButton = ({ onUpload, className, defaultValue }: Props) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpload(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={cn("flex gap-4 items-center", className)}>
      {defaultValue && (
        <Image
          src={defaultValue}
          alt="preview"
          width={50}
          height={50}
          className="rounded-md object-cover"
        />
      )}
      <Input
        ref={ref}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => ref.current?.click()}
      >
        Обрати файл
      </Button>
    </div>
  );
};
