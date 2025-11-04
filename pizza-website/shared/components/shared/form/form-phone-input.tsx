"use client";

import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { IMaskInput } from "react-imask";
import { cn } from "@/shared/lib/utils";
import { ClearButton } from "../clear-button";
import { ErrorText } from "../error-text";
import { RequiredSymbol } from "../required-synbol";

interface Props {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

export const FormPhoneInput: React.FC<Props> = ({
  className,
  name,
  label,
  required,
  placeholder = "+380 __ ___ __ __",
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorText = errors[name]?.message as string | undefined;

  return (
    <div className={className}>
      {label && (
        <p className="font-medium mb-2">
          {label} {required && <RequiredSymbol />}
        </p>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const hasValue = Boolean(field.value);

          return (
            <div className="relative">
              <IMaskInput
                {...field}
                mask="+380 00 000 00 00"
                lazy={false}
                autofix={true}
                inputMode="tel"
                value={field.value ?? ""}
                placeholder={placeholder}
                aria-invalid={errorText ? "true" : "false"}
                onAccept={(value) => field.onChange(value)}
                className={cn(
                  "file:text-foreground placeholder:text-muted-foreground selection:bg-[var(--primary)] selection:text-text-[var(--primary-foreground)] dark:bg-input/30 border-input flex h-12 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                )}
              />

              {hasValue && <ClearButton onClick={() => field.onChange("")} />}
            </div>
          );
        }}
      />

      {errorText && <ErrorText text={errorText} className="mt-2" />}
    </div>
  );
};
