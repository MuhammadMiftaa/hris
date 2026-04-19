import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  bottomContent?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  bottomContent,
  className,
  contentClassName,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex flex-col gap-3 border-b border-(--border) bg-(--card)",
        !bottomContent && "px-4 py-3 sm:px-6 sm:py-3.5",
        className
      )}
    >
      <div 
        className={cn(
          "flex flex-row md:items-center justify-between gap-3",
          bottomContent && "px-4 pt-3 sm:px-6 sm:pt-3.5",
          contentClassName
        )}
      >
        <div>
          <h1 className="text-xl font-bold tracking-wide text-(--foreground) md:text-lg">
            {title}
          </h1>
          {description && (
             typeof description === 'string' ? (
              <p className="text-[10px] text-(--muted-foreground) md:text-xs hidden sm:block">
                {description}
              </p>
             ) : (
               description
             )
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            {actions}
          </div>
        )}
      </div>
      {bottomContent && (
        <div className="px-4 sm:px-6 pb-2">
          {bottomContent}
        </div>
      )}
    </header>
  );
}
