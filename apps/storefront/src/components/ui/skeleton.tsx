import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-xl bg-[#e8e8ed] dark:bg-[#2c2c2e]", className)}
      {...props}
    />
  )
}

export { Skeleton }
