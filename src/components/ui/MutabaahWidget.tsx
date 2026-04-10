import { BookOpen, Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MutabaahTodayStatus } from "@/types/mutabaah";

interface MutabaahWidgetProps {
  status: MutabaahTodayStatus;
  onSubmit: () => void;
  onCancel: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function MutabaahWidget({
  status,
  onSubmit,
  onCancel,
  disabled,
  loading,
}: MutabaahWidgetProps) {
  if (!status.has_record) return null;

  const formatTime = (ts: string | null) => {
    if (!ts) return "";
    return new Date(ts).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border transition-all duration-300",
        status.is_submitted
          ? "border-green-500/30 bg-green-500/5"
          : "border-(--border) bg-(--card)",
      )}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Icon */}
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all",
            status.is_submitted
              ? "bg-green-500/15 text-green-600"
              : "bg-(--primary)/10 text-(--primary)",
          )}
        >
          <BookOpen size={22} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-sm font-semibold",
              status.is_submitted
                ? "text-green-700 dark:text-green-400"
                : "text-(--foreground)",
            )}
          >
            {status.is_submitted
              ? "✅ Tilawah Selesai"
              : "📖 Tilawah Hari Ini"}
          </p>
          <p className="text-xs text-(--muted-foreground)">
            {status.is_submitted
              ? `Sudah membaca ${status.target_pages} halaman · ${formatTime(status.submitted_at)}`
              : `Target: ${status.target_pages} Halaman Al-Quran`}
          </p>
        </div>

        {/* Action */}
        {status.is_submitted ? (
          <button
            onClick={onCancel}
            disabled={disabled || loading}
            className="shrink-0 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-500/10 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <span className="flex items-center gap-1">
                <X size={12} />
                Batalkan
              </span>
            )}
          </button>
        ) : (
          <button
            onClick={onSubmit}
            disabled={disabled || loading}
            className="shrink-0 rounded-lg bg-(--primary) px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            style={{
              boxShadow: "0 2px 8px rgba(209,0,113,0.3)",
            }}
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <span className="flex items-center gap-1.5">
                <Check size={14} />
                Sudah Baca {status.target_pages} Halaman
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export function MutabaahWidgetSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-(--border) bg-(--card) p-4">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-(--muted) animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 rounded bg-(--muted) animate-pulse" />
          <div className="h-3 w-48 rounded bg-(--muted) animate-pulse" />
        </div>
        <div className="h-8 w-28 rounded-lg bg-(--muted) animate-pulse" />
      </div>
    </div>
  );
}
