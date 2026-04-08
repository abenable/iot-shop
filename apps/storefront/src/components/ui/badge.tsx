import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border border-transparent px-3 py-0.5 text-xs font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#0071e3]/50 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 aria-invalid:border-[#ff3b30] aria-invalid:ring-[#ff3b30]/20 dark:aria-invalid:ring-[#ff453a]/40 [&>svg]:pointer-events-none [&>svg]:size-3.5!",
  {
    variants: {
      variant: {
        default: "bg-[#0071e3] text-white [a]:hover:bg-[#0077ed]",
        secondary:
          "bg-[#f5f5f7] text-[#1d1d1f] [a]:hover:bg-[#e8e8ed] dark:bg-[#2c2c2e] dark:text-[#f5f5f7]",
        destructive:
          "bg-[#ff3b30]/10 text-[#ff3b30] focus-visible:ring-[#ff3b30]/20 dark:bg-[#ff453a]/20 [a]:hover:bg-[#ff3b30]/20",
        outline:
          "border-[#d2d2d7] text-[#1d1d1f] [a]:hover:bg-[#f5f5f7] dark:border-[#38383a] dark:text-[#f5f5f7]",
        success:
          "bg-[#34c759]/10 text-[#34c759] [a]:hover:bg-[#34c759]/20 dark:bg-[#30d158]/20",
        warning:
          "bg-[#ff9500]/10 text-[#ff9500] [a]:hover:bg-[#ff9500]/20 dark:bg-[#ff9f0a]/20",
        ghost:
          "hover:bg-[#f5f5f7] hover:text-[#1d1d1f] dark:hover:bg-[#2c2c2e] dark:hover:text-[#f5f5f7]",
        link: "text-[#0071e3] underline-offset-4 hover:underline [a]:hover:text-[#0077ed]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
