import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full rounded-xl border border-[#d2d2d7] bg-[#f5f5f7]/50 px-4 py-3 text-base transition-all duration-200 outline-none placeholder:text-[#86868b] focus-visible:bg-white focus-visible:border-[#0071e3] focus-visible:ring-2 focus-visible:ring-[#0071e3]/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[#ff3b30] aria-invalid:ring-2 aria-invalid:ring-[#ff3b30]/20 md:text-sm dark:bg-[#2c2c2e]/50 dark:border-[#38383a] dark:focus-visible:bg-[#1d1d1f]",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
