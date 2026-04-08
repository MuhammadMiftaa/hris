import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  ClipboardCheck,
  CalendarOff,
  Clock,
  FileCheck,
  AlertTriangle,
  Send,
  Plane,
  Edit2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard, StatCardSkeleton } from "@/components/ui/StatCard";
import { ClockWidget, ClockWidgetSkeleton } from "@/components/ui/ClockWidget";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuth } from "@/contexts/AuthContext";
import { useEmployeeProfile } from "@/hooks/useEmployeeProfile";
import {
  useEmployeeDashboard,
  useHRDDashboard,
  useClockWidget,
} from "@/hooks/useDashboard";
import type {
  LeaveBalanceSummary,
  PendingRequest,
  ApprovalQueueItem,
  NotClockedInEmployee,
  ExpiringContract,
} from "@/types/dashboard";

const REQUEST_TYPE_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; color: string }
> = {
  leave: { label: "Cuti", icon: CalendarOff, color: "#3b82f6" },
  permission: { label: "Izin", icon: Clock, color: "#8b5cf6" },
  overtime: { label: "Lembur", icon: Clock, color: "#f59e0b" },
  business_trip: { label: "Dinas", icon: Plane, color: "#10b981" },
  override: { label: "Koreksi", icon: Edit2, color: "#ef4444" },
};

function ViewToggle({
  view,
  setView,
}: {
  view: "employee" | "hrd";
  setView: (v: "employee" | "hrd") => void;
}) {
  return (
    <div className="flex rounded-lg border border-(--border) bg-(--muted)/30 p-1">
      <button
        onClick={() => setView("employee")}
        className={cn(
          "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          view === "employee"
            ? "bg-(--card) text-(--foreground) shadow-sm"
            : "text-(--muted-foreground) hover:text-(--foreground)",
        )}
      >
        Pegawai
      </button>
      <button
        onClick={() => setView("hrd")}
        className={cn(
          "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
          view === "hrd"
            ? "bg-(--card) text-(--foreground) shadow-sm"
            : "text-(--muted-foreground) hover:text-(--foreground)",
        )}
      >
        HRD
      </button>
    </div>
  );
}

function LeaveBalanceCard({ balance }: { balance: LeaveBalanceSummary }) {
  const percentage =
    balance.total_quota && balance.remaining !== null
      ? ((balance.total_quota - balance.used) / balance.total_quota) * 100
      : 100;

  return (
    <div className="rounded-lg border border-(--border) bg-(--card) p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-(--foreground)">
          {balance.leave_type_name}
        </span>
        <span className="text-xs text-(--muted-foreground)">
          {balance.remaining !== null
            ? `${balance.remaining} tersisa`
            : "Unlimited"}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-(--muted) overflow-hidden">
          <div
            className="h-full bg-(--primary) rounded-full transition-all"
            style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
          />
        </div>
        <span className="text-xs font-medium text-(--muted-foreground)">
          {balance.used}/{balance.total_quota ?? "∞"}
        </span>
      </div>
    </div>
  );
}

function PendingRequestCard({ request }: { request: PendingRequest }) {
  const config = REQUEST_TYPE_CONFIG[request.type];
  const Icon = config?.icon || Send;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-(--border) bg-(--card) p-3">
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ background: `${config?.color || "#6b7280"}20` }}
      >
        <Icon size={16} style={{ color: config?.color || "#6b7280" }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-(--foreground) truncate">
          {request.label}
        </div>
        <div className="text-xs text-(--muted-foreground)">
          {new Date(request.created_at).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
          })}
        </div>
      </div>
      <span className="shrink-0 rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs font-medium text-yellow-600">
        Pending
      </span>
    </div>
  );
}

function ApprovalQueueRow({ item }: { item: ApprovalQueueItem }) {
  const config = REQUEST_TYPE_CONFIG[item.type];
  return (
    <tr className="border-b border-(--border) last:border-0">
      <td className="py-3 px-4">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
          style={{
            background: `${config?.color || "#6b7280"}15`,
            color: config?.color || "#6b7280",
          }}
        >
          {config?.label || item.type}
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-(--foreground)">
        {item.employee_name}
      </td>
      <td className="py-3 px-4 text-sm text-(--muted-foreground) max-w-50 truncate">
        {item.label}
      </td>
      <td className="py-3 px-4 text-xs text-(--muted-foreground)">
        {new Date(item.created_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
        })}
      </td>
    </tr>
  );
}

function NotClockedInRow({ employee }: { employee: NotClockedInEmployee }) {
  return (
    <tr className="border-b border-(--border) last:border-0">
      <td className="py-2.5 px-4 text-sm font-medium text-(--foreground)">
        {employee.employee_name}
      </td>
      <td className="py-2.5 px-4 text-xs text-(--muted-foreground)">
        {employee.employee_number}
      </td>
      <td className="py-2.5 px-4 text-xs text-(--muted-foreground)">
        {employee.department_name || "-"}
      </td>
      <td className="py-2.5 px-4 text-xs text-(--muted-foreground)">
        {employee.shift_start || "-"}
      </td>
    </tr>
  );
}

function ExpiringContractCard({ contract }: { contract: ExpiringContract }) {
  const isUrgent = contract.days_remaining <= 14;
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border p-3",
        isUrgent
          ? "border-red-500/30 bg-red-500/5"
          : "border-(--border) bg-(--card)",
      )}
    >
      <div
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          isUrgent ? "bg-red-500/10" : "bg-amber-500/10",
        )}
      >
        <FileCheck
          size={16}
          className={isUrgent ? "text-red-500" : "text-amber-500"}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-(--foreground)">
          {contract.employee_name}
        </div>
        <div className="text-xs text-(--muted-foreground)">
          {contract.contract_type} • Berakhir{" "}
          {new Date(contract.end_date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>
      <span
        className={cn(
          "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
          isUrgent
            ? "bg-red-500/10 text-red-600"
            : "bg-amber-500/10 text-amber-600",
        )}
      >
        {contract.days_remaining} hari
      </span>
    </div>
  );
}

function EmployeeDashboardView() {
  const { data, loading } = useEmployeeDashboard();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-48 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <EmptyState
        title="Data dashboard tidak tersedia"
        description="Tidak dapat memuat data dashboard"
        icon={<ClipboardCheck className="h-12 w-12" />}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-3 text-sm font-semibold text-(--foreground)">
          Ringkasan Kehadiran Bulan Ini
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={ClipboardCheck}
            label="Hadir"
            value={data.monthly_summary.total_present}
            color="#10b981"
            onClick={() => navigate("/attendance")}
          />
          <StatCard
            icon={Clock}
            label="Terlambat"
            value={data.monthly_summary.total_late}
            color="#f59e0b"
            onClick={() => navigate("/attendance")}
          />
          <StatCard
            icon={AlertTriangle}
            label="Absen"
            value={data.monthly_summary.total_absent}
            color="#ef4444"
          />
          <StatCard
            icon={CalendarOff}
            label="Cuti"
            value={data.monthly_summary.total_leave}
            color="#3b82f6"
            onClick={() => navigate("/leave")}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-(--border) bg-(--card) p-5">
          <h3 className="mb-4 font-semibold text-(--foreground)">Saldo Cuti</h3>
          {data.leave_balances.length === 0 ? (
            <p className="text-sm text-(--muted-foreground)">
              Tidak ada data saldo cuti
            </p>
          ) : (
            <div className="space-y-3">
              {data.leave_balances.map((balance) => (
                <LeaveBalanceCard
                  key={balance.leave_type_id}
                  balance={balance}
                />
              ))}
            </div>
          )}
        </div>
        <div className="rounded-xl border border-(--border) bg-(--card) p-5">
          <h3 className="mb-4 font-semibold text-(--foreground)">
            Pengajuan Pending
          </h3>
          {data.pending_requests.length === 0 ? (
            <p className="text-sm text-(--muted-foreground)">
              Tidak ada pengajuan yang pending
            </p>
          ) : (
            <div className="space-y-3">
              {data.pending_requests.map((request) => (
                <PendingRequestCard key={request.id} request={request} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HRDDashboardView() {
  const { data, loading } = useHRDDashboard();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <EmptyState
        title="Data dashboard tidak tersedia"
        description="Tidak dapat memuat data dashboard HRD"
        icon={<Users className="h-12 w-12" />}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-3 text-sm font-semibold text-(--foreground)">
          Pengajuan Menunggu Persetujuan
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            icon={CalendarOff}
            label="Cuti"
            value={data.approval_counts.leave}
            color="#3b82f6"
            onClick={() => navigate("/leave")}
          />
          <StatCard
            icon={Clock}
            label="Izin"
            value={data.approval_counts.permission}
            color="#8b5cf6"
            onClick={() => navigate("/requests")}
          />
          <StatCard
            icon={Clock}
            label="Lembur"
            value={data.approval_counts.overtime}
            color="#f59e0b"
            onClick={() => navigate("/requests")}
          />
          <StatCard
            icon={Plane}
            label="Dinas"
            value={data.approval_counts.business_trip}
            color="#10b981"
            onClick={() => navigate("/requests")}
          />
          <StatCard
            icon={Edit2}
            label="Koreksi"
            value={data.approval_counts.override}
            color="#ef4444"
            onClick={() => navigate("/attendance")}
          />
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-(--foreground)">
          Ringkasan Tim Hari Ini
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Users}
            label="Total Pegawai"
            value={data.team_attendance.total_employees}
            color="#6b7280"
          />
          <StatCard
            icon={ClipboardCheck}
            label="Hadir"
            value={data.team_attendance.present_today}
            color="#10b981"
            subtitle={`dari ${data.team_attendance.total_employees} pegawai`}
          />
          <StatCard
            icon={Clock}
            label="Terlambat"
            value={data.team_attendance.late_today}
            color="#f59e0b"
          />
          <StatCard
            icon={AlertTriangle}
            label="Belum Absen"
            value={data.team_attendance.not_clocked_in}
            color="#ef4444"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-(--border) bg-(--card) overflow-hidden">
          <div className="border-b border-(--border) px-5 py-3">
            <h3 className="font-semibold text-(--foreground)">
              Belum Clock In Hari Ini
            </h3>
          </div>
          {data.not_clocked_in.length === 0 ? (
            <div className="p-5">
              <p className="text-sm text-(--muted-foreground)">
                Semua pegawai sudah clock in
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-(--border) bg-(--muted)/30">
                    <th className="py-2 px-4 text-left text-xs font-medium text-(--muted-foreground)">
                      Nama
                    </th>
                    <th className="py-2 px-4 text-left text-xs font-medium text-(--muted-foreground)">
                      NIP
                    </th>
                    <th className="py-2 px-4 text-left text-xs font-medium text-(--muted-foreground)">
                      Departemen
                    </th>
                    <th className="py-2 px-4 text-left text-xs font-medium text-(--muted-foreground)">
                      Shift
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.not_clocked_in.slice(0, 5).map((emp) => (
                    <NotClockedInRow key={emp.employee_id} employee={emp} />
                  ))}
                </tbody>
              </table>
              {data.not_clocked_in.length > 5 && (
                <div className="border-t border-(--border) px-5 py-2 text-center">
                  <button
                    onClick={() => navigate("/attendance")}
                    className="text-xs font-medium text-(--primary) hover:underline"
                  >
                    Lihat semua ({data.not_clocked_in.length})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-(--border) bg-(--card) p-5">
          <h3 className="mb-4 font-semibold text-(--foreground)">
            Kontrak Akan Habis
          </h3>
          {data.expiring_contracts.length === 0 ? (
            <p className="text-sm text-(--muted-foreground)">
              Tidak ada kontrak yang akan habis dalam waktu dekat
            </p>
          ) : (
            <div className="space-y-3">
              {data.expiring_contracts.map((contract) => (
                <ExpiringContractCard
                  key={contract.employee_id}
                  contract={contract}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {data.approval_queue.length > 0 && (
        <div className="rounded-xl border border-(--border) bg-(--card) overflow-hidden">
          <div className="border-b border-(--border) px-5 py-3">
            <h3 className="font-semibold text-(--foreground)">
              Antrian Persetujuan
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-(--border) bg-(--muted)/30">
                  <th className="py-2 px-4 text-left text-xs font-medium text-(--muted-foreground)">
                    Tipe
                  </th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-(--muted-foreground)">
                    Pegawai
                  </th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-(--muted-foreground)">
                    Keterangan
                  </th>
                  <th className="py-2 px-4 text-left text-xs font-medium text-(--muted-foreground)">
                    Tanggal
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.approval_queue.map((item) => (
                  <ApprovalQueueRow key={item.id} item={item} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export function DashboardPage() {
  const { cachedProfile } = useAuth();
  const { data: profile } = useEmployeeProfile();
  const clockWidget = useClockWidget();

  const roleName = profile?.role_name || "";
  const isHRD =
    roleName === "HRD Admin" ||
    roleName === "Super Admin" ||
    roleName === "Supervisor";

  const [view, setView] = useState<"employee" | "hrd">(
    isHRD ? "hrd" : "employee",
  );

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  const formatDate = () => {
    return new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6">
        {/* Clock widget FIRST on mobile, moves after header on desktop */}
        <div className="md:hidden">
          {clockWidget.loading ? (
            <ClockWidgetSkeleton />
          ) : (
            <ClockWidget
              status={clockWidget.status}
              isMobile={clockWidget.isMobile}
              onClockIn={() => clockWidget.clockIn()}
              onClockOut={() => clockWidget.clockOut()}
              disabled={false}
              loading={clockWidget.loading}
            />
          )}
        </div>

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-(--foreground)">
              {greeting()},{" "}
              <span className="text-primary-gradient">
                {profile?.full_name || cachedProfile?.fullname || "User"}
              </span>
            </h1>
            <p className="text-sm text-(--muted-foreground)">{formatDate()}</p>
          </div>
          {isHRD && <ViewToggle view={view} setView={setView} />}
        </div>

        {/* Clock Widget — desktop only (hidden on mobile, shown above) */}
        <div className="hidden md:block max-w-md mx-auto">
          {clockWidget.loading ? (
            <ClockWidgetSkeleton />
          ) : (
            <ClockWidget
              status={clockWidget.status}
              isMobile={clockWidget.isMobile}
              onClockIn={() => clockWidget.clockIn()}
              onClockOut={() => clockWidget.clockOut()}
              disabled={false}
              loading={clockWidget.loading}
            />
          )}
        </div>

        {/* Dashboard Content */}
        {view === "employee" ? <EmployeeDashboardView /> : <HRDDashboardView />}
      </div>
    </MainLayout>
  );
}
