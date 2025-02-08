import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import cn from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-semibold capitalize ring-offset-background transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none aria-disabled:pointer-events-none disabled:opacity-50 aria-disabled:opacity-50 gap-1",
  {
    variants: {
      variant: {
        default:
          "bg-main text-main-foreground hover:bg-alt hover:text-alt-foreground",
        secondary: "bg-alt text-alt-foreground hover:bg-alt/80",
        light: "bg-gray-200 text-dark hover:bg-dark hover:text-white",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        dark: "bg-dark text-white border-2 hover:text-dark hover:bg-white hover:border-black",
        link: "text-dark-gray gap-1",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
