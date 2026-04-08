"use client"

import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { cn } from "@/lib/utils"

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "group/radio-group-item peer relative flex aspect-square size-5 shrink-0 rounded-full border-2 border-[#d2d2d7] bg-white outline-none transition-all duration-200 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-[#0071e3] focus-visible:ring-2 focus-visible:ring-[#0071e3]/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[#ff3b30] aria-invalid:ring-2 aria-invalid:ring-[#ff3b30]/20 dark:bg-[#2c2c2e] dark:border-[#38383a] data-checked:border-[#0071e3] data-checked:bg-[#0071e3]",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-5 items-center justify-center"
      >
        <span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
