import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

// Placeholder illustration SVGs
function IllustrationEmpty({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 90"
      fill="none"
      className={cn("opacity-40", className)}
      aria-hidden="true"
    >
      <rect
        x="10"
        y="20"
        width="100"
        height="60"
        rx="8"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 3"
      />
      <circle cx="60" cy="50" r="18" stroke="currentColor" strokeWidth="2" />
      <path
        d="M52 50h16M60 42v16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M25 15 Q60 5 95 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="3 2"
      />
    </svg>
  );
}

const ILLUSTRATIONS = {
  empty: IllustrationEmpty,
};

export type IllustrationType = keyof typeof ILLUSTRATIONS;

interface EmptyStateFullProps extends EmptyStateProps {
  illustration?: IllustrationType;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
  size = "md",
  illustration,
}: EmptyStateFullProps) {
  const Illustration = illustration ? ILLUSTRATIONS[illustration] : null;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        size === "sm" && "gap-1.5 py-4",
        size === "md" && "gap-2.5 py-8",
        size === "lg" && "gap-3 py-12",
        className,
      )}
    >
      {Illustration ? (
        <Illustration
          className={cn(
            "text-(--muted-foreground)",
            size === "sm" && "h-12 w-16",
            size === "md" && "h-16 w-20",
            size === "lg" && "h-24 w-32",
          )}
        />
      ) : icon ? (
        <div className="text-(--muted-foreground) opacity-40">{icon}</div>
      ) : null}
      <div>
        <p
          className={cn(
            "font-semibold text-(--foreground)",
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            size === "lg" && "text-base",
          )}
        >
          {title}
        </p>
        {description && (
          <p
            className={cn(
              "mt-0.5 text-(--muted-foreground)",
              size === "sm" && "text-[10px]",
              size === "md" && "text-xs",
              size === "lg" && "text-sm",
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}