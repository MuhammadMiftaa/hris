import { cn } from "@/lib/utils";
import React from "react";

export interface SummaryCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  colorBg?: string; 
  colorText?: string; 
  titleClassName?: string;
  valueClassName?: string;
  subtitleClassName?: string;
}

export function SummaryCard({
  title,
  value,
  subtitle,
  colorBg,
  colorText,
  titleClassName,
  valueClassName,
  subtitleClassName,
  className,
  ...props
}: SummaryCardProps) {
  const isCustomColor = !!(colorBg || colorText);

  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3",
        isCustomColor ? cn(colorBg, "border-transparent") : "border-(--border) bg-(--card)",
        className
      )}
      {...props}
    >
      <p
        className={cn(
          "text-xs",
          isCustomColor ? cn("font-medium", colorText) : "text-(--muted-foreground)",
          titleClassName
        )}
      >
        {title}
      </p>
      <p
        className={cn(
          "text-2xl font-bold",
          isCustomColor ? colorText : "text-(--foreground)",
          valueClassName
        )}
      >
        {value}
      </p>
      {subtitle !== undefined && (
        <p
          className={cn(
            "text-xs",
            isCustomColor ? cn(colorText, "opacity-70") : "text-(--muted-foreground)",
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
