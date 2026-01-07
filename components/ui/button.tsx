import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { ArrowBigLeft, ArrowRight } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-lg cursor-pointer font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 pl-4 pr-1 py-2 has-[>svg]:px-3",
        sm: "h-8 gap-1.5 pl-3 pr-1 has-[>svg]:px-2.5",
        lg: "h-12 pl-6 pr-1 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  children,
  className,
  variant,
  size,
  hideIcon,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    hideIcon?: React.ReactNode;
  }) {
  // If asChild is used and children is a valid element, clone it and append the icon as the new child
  if (asChild && React.isValidElement(children)) {
    const childClass = cn(
      buttonVariants({ variant, size }),
      (children.props as any)?.className,
      className
    );

    return React.cloneElement(
      children,
      { ...props, className: childClass },
      <>
        {(children.props as any)?.children}
        {!hideIcon && <span className="bg-white p-2 rounded-full"> <ArrowRight /></span> }
      </>
    );
  }

  // Default button rendering
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
      {!hideIcon && <span className="bg-white p-2 rounded-full"> <ArrowRight /></span> }
    </button>
  );
}

export { Button, buttonVariants };
