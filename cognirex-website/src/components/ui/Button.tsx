import React from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "yellow" | "purple" | "purple-outline" | "secondary-link" | "white";
  size?: "sm" | "md" | "lg";
  icon?: boolean;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      href,
      variant = "yellow",
      size = "md",
      icon = false,
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer";

    const sizeStyles = {
      sm: "text-xs px-3.5 py-1.5 gap-1.5 h-8",
      md: "text-sm px-5 py-2.5 gap-2 h-11",
      lg: "text-base px-6 py-3.5 gap-2.5 h-13",
    };

    const variantStyles = {
      yellow:
        "bg-[#FACC15] hover:bg-[#EAB308] text-[#1F1B2E] font-semibold shadow-sm hover:-translate-y-0.5 active:translate-y-0",
      purple:
        "bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-medium shadow-sm hover:-translate-y-0.5 active:translate-y-0",
      "purple-outline":
        "border border-[#7C3AED] text-[#7C3AED] hover:bg-[#EEE8FA] font-medium hover:-translate-y-0.5 active:translate-y-0",
      white:
        "bg-white hover:bg-[#F8F7FC] text-[#1F1B2E] border border-[#E5E1ED] font-medium shadow-sm hover:-translate-y-0.5 active:translate-y-0",
      "secondary-link":
        "text-[#1F1B2E] hover:text-[#7C3AED] font-medium underline-offset-4 hover:underline p-0 h-auto rounded-none !shadow-none !bg-transparent",
    };

    const content = (
      <>
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        <span>{children}</span>
        {icon && !isLoading && (
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        )}
      </>
    );

    if (href) {
      if (href.startsWith("#")) {
        return (
          <a
            href={href}
            onClick={(props as any).onClick}
            className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
          >
            {content}
          </a>
        );
      }
      return (
        <Link
          href={href}
          onClick={(props as any).onClick}
          className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

