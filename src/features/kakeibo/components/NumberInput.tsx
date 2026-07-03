import type { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form"

import { Input } from "@/features/shared/components/ui/input"

interface NumberInputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> {
  field: ControllerRenderProps<TFieldValues, TName>
  placeholder?: string
  className?: string
}

export function NumberInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({ field, placeholder, className }: NumberInputProps<TFieldValues, TName>) {
  return (
    <Input
      type="number"
      placeholder={placeholder}
      className={className}
      name={field.name}
      ref={field.ref}
      onBlur={field.onBlur}
      value={field.value as number}
      onChange={(e) => field.onChange(e.target.valueAsNumber)}
    />
  )
}
