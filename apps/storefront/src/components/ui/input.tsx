import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-xl border border-[#d2d2d7] bg-[#f5f5f7]/50 px-4 py-2 text-base transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#1d1d1f] placeholder:text-[#86868b] focus-visible:bg-white focus-visible:border-[#0071e3] focus-visible:ring-2 focus-visible:ring-[#0071e3]/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[#ff3b30] aria-invalid:ring-2 aria-invalid:ring-[#ff3b30]/20 md:text-sm dark:bg-[#2c2c2e]/50 dark:border-[#38383a] dark:focus-visible:bg-[#1d1d1f] dark:aria-invalid:border-[#ff453a]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
