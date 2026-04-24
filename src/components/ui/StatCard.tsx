import { cn } from "@/lib/utils";

// ══════════════════════════════════════════════════════════════════════════════
// StatCard Component — Reusable stat card for dashboards (§13)
// ══════════════════════════════════════════════════════════════════════════════

export interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  subtitle?: string; // opsional — "dari 45 pegawai"
  onClick?: () => void; // navigasi ke halaman detail
  className?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  color,
  subtitle,
  onClick,
  className,
}: StatCardProps) {
  const isClickable = !!onClick;

  return (
    <div
      className={cn(
        "relative flex flex-col gap-2 overflow-hidden rounded-xl border border-(--border) bg-(--card) px-5 py-4",
        isClickable &&
          "cursor-pointer transition-all hover:border-(--primary)/30 hover:shadow-md",
        className,
      )}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {/* Top color bar */}
      <div
        className="absolute left-0 right-0 top-0 h-0.5 rounded-t-xl opacity-70"
        style={{ background: color }}
      />

      <div className="flex gap-3">
        {/* Icon */}
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ background: `${color}20` }}
        >
          <Icon size={20} style={{ color }} />
        </div>

        {/* Content */}
        <div className="flex-1">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-(--muted-foreground)">
            {label}
          </span>
          <div className="font-mono text-xl font-bold text-(--foreground)">
            {value}
          </div>
          {subtitle && (
            <span className="text-xs text-(--muted-foreground)">
              {subtitle}
            </span>
          )}
        </div>

        {/* Clickable indicator */}
        {isClickable && (
          <div className="text-(--muted-foreground)">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// StatCardSkeleton — Loading state for StatCard
// ══════════════════════════════════════════════════════════════════════════════

export function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-2 overflow-hidden rounded-xl border border-(--border) bg-(--card) px-5 py-4",
        className,
      )}
    >
      <div className="absolute left-0 right-0 top-0 h-0.5 rounded-t-xl bg-(--muted) opacity-70" />
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-lg bg-(--muted)" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-20 animate-pulse rounded bg-(--muted)" />
          <div className="h-6 w-12 animate-pulse rounded bg-(--muted)" />
        </div>
      </div>
    </div>
  );
}
