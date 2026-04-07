import { useState, useEffect } from "react";
import { Clock, LogIn, LogOut, Smartphone, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TodayAttendanceStatus } from "@/types/dashboard";

// ══════════════════════════════════════════════════════════════════════════════
// ClockWidget Component — Clock in/out widget for dashboard (§13.3)
// ══════════════════════════════════════════════════════════════════════════════

export interface ClockWidgetProps {
  status: TodayAttendanceStatus;
  isMobile: boolean;
  onClockIn: () => void;
  onClockOut: () => void;
  disabled?: boolean; // demo mode or loading
  loading?: boolean;
}

/**
 * Format time as HH:mm:ss
 */
function formatTime(date: Date): string {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

/**
 * Format date as "Senin, 7 April 2026"
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Format clock time from ISO string
 */
function formatClockTime(isoString: string | null): string {
  if (!isoString) return "-";
  const date = new Date(isoString);
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function ClockWidget({
  status,
  isMobile,
  onClockIn,
  onClockOut,
  disabled = false,
  loading = false,
}: ClockWidgetProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Determine button state
  const canClockIn = !status.has_clocked_in;
  const canClockOut = status.has_clocked_in && !status.has_clocked_out;
  const isComplete = status.has_clocked_in && status.has_clocked_out;

  // Status badge text
  const getStatusText = () => {
    if (isComplete) {
      return `Sudah Clock Out (${formatClockTime(status.clock_out_at)})`;
    }
    if (status.has_clocked_in) {
      return `Sudah Clock In (${formatClockTime(status.clock_in_at)})`;
    }
    return "Belum Clock In";
  };

  // Status badge color
  const getStatusColor = () => {
    if (isComplete) return "bg-blue-500/10 text-blue-600";
    if (status.has_clocked_in) return "bg-green-500/10 text-green-600";
    return "bg-yellow-500/10 text-yellow-600";
  };

  return (
    <div className="overflow-hidden rounded-xl border border-(--border) bg-(--card)">
      {/* Header */}
      <div className="border-b border-(--border) bg-(--muted)/30 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-(--primary)" />
            <span className="font-medium text-(--foreground)">
              Presensi Hari Ini
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-(--muted-foreground)">
            {isMobile ? (
              <>
                <Smartphone size={14} />
                <span>Mobile</span>
              </>
            ) : (
              <>
                <Monitor size={14} />
                <span>Desktop</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        {/* Current Time Display */}
        <div className="mb-4 text-center">
          <div className="font-mono text-4xl font-bold text-(--foreground) md:text-5xl">
            {formatTime(currentTime)}
          </div>
          <div className="mt-1 text-sm text-(--muted-foreground)">
            {formatDate(currentTime)}
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-4 flex justify-center">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
              getStatusColor(),
            )}
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                isComplete && "bg-blue-500",
                status.has_clocked_in && !isComplete && "bg-green-500",
                !status.has_clocked_in && "bg-yellow-500 animate-pulse",
              )}
            />
            {getStatusText()}
          </span>
        </div>

        {/* Late indicator */}
        {status.late_minutes > 0 && (
          <div className="mb-4 text-center">
            <span className="text-sm text-red-500">
              Terlambat {status.late_minutes} menit
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {canClockIn && (
            <button
              onClick={onClockIn}
              disabled={disabled || loading}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition-all",
                "bg-green-600 text-white hover:bg-green-700",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <LogIn size={20} />
              )}
              Clock In
            </button>
          )}

          {canClockOut && (
            <button
              onClick={onClockOut}
              disabled={disabled || loading}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition-all",
                "bg-red-600 text-white hover:bg-red-700",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <LogOut size={20} />
              )}
              Clock Out
            </button>
          )}

          {isComplete && (
            <div className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-(--muted)/50 px-4 py-3 text-(--muted-foreground)">
              <Clock size={20} />
              Presensi Lengkap
            </div>
          )}
        </div>

        {/* Desktop Warning Banner */}
        {!isMobile && !isComplete && (
          <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2">
            <p className="text-center text-xs text-amber-600">
              📱 Presensi lebih akurat dari perangkat mobile dengan GPS
            </p>
          </div>
        )}
      </div>

      {/* Clock In/Out Time Summary */}
      {(status.has_clocked_in || status.has_clocked_out) && (
        <div className="border-t border-(--border) bg-(--muted)/20 px-5 py-3">
          <div className="flex justify-around text-center">
            <div>
              <div className="text-xs text-(--muted-foreground)">Jam Masuk</div>
              <div className="font-mono text-sm font-semibold text-(--foreground)">
                {formatClockTime(status.clock_in_at)}
              </div>
            </div>
            <div className="h-8 w-px bg-(--border)" />
            <div>
              <div className="text-xs text-(--muted-foreground)">
                Jam Keluar
              </div>
              <div className="font-mono text-sm font-semibold text-(--foreground)">
                {formatClockTime(status.clock_out_at)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ClockWidgetSkeleton — Loading state for ClockWidget
// ══════════════════════════════════════════════════════════════════════════════

export function ClockWidgetSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-(--border) bg-(--card)">
      <div className="border-b border-(--border) bg-(--muted)/30 px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 animate-pulse rounded bg-(--muted)" />
          <div className="h-4 w-32 animate-pulse rounded bg-(--muted)" />
        </div>
      </div>
      <div className="px-5 py-4">
        <div className="mb-4 flex flex-col items-center gap-2">
          <div className="h-12 w-48 animate-pulse rounded bg-(--muted)" />
          <div className="h-4 w-40 animate-pulse rounded bg-(--muted)" />
        </div>
        <div className="mb-4 flex justify-center">
          <div className="h-7 w-36 animate-pulse rounded-full bg-(--muted)" />
        </div>
        <div className="h-12 w-full animate-pulse rounded-lg bg-(--muted)" />
      </div>
    </div>
  );
}
