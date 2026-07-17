import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/friday/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "border-border bg-surface text-muted-foreground hover:text-foreground",
        active:
          "border-purple-500/50 bg-purple-500/10 text-purple-600 dark:text-purple-400",
        outline: "border-border text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
