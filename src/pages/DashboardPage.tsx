import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users,
  Building2,
  Briefcase,
  ClipboardCheck,
  CalendarOff,
  FileText,
} from "lucide-react";

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="relative flex flex-col gap-2 overflow-hidden rounded-xl border border-(--border) bg-(--card) px-5 py-4">
      <div
        className="absolute left-0 right-0 top-0 h-0.5 rounded-t-xl opacity-70"
        style={{ background: color }}
      />
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ background: `${color}20` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-(--muted-foreground)">
            {label}
          </span>
          <div className="font-mono text-xl font-bold text-(--foreground)">
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { cachedProfile } = useAuth();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-(--foreground)">
            {greeting()},{" "}
            <span className="text-primary-gradient">
              {cachedProfile?.fullname || "User"}
            </span>
          </h1>
          <p className="text-sm text-(--muted-foreground)">
            Selamat datang di Dashboard HRIS Wafa Indonesia
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={Users}
            label="Total Pegawai"
            value="-"
            color="#3b82f6"
          />
          <StatCard
            icon={Building2}
            label="Total Cabang"
            value="-"
            color="#10b981"
          />
          <StatCard
            icon={Briefcase}
            label="Total Jabatan"
            value="-"
            color="#f59e0b"
          />
          <StatCard
            icon={ClipboardCheck}
            label="Presensi Hari Ini"
            value="-"
            color="#8b5cf6"
          />
          <StatCard
            icon={CalendarOff}
            label="Pengajuan Cuti"
            value="-"
            color="#ef4444"
          />
          <StatCard
            icon={FileText}
            label="Laporan Harian"
            value="-"
            color="#06b6d4"
          />
        </div>

        {/* Quick Access Section */}
        <div className="rounded-xl border border-(--border) bg-(--card) p-5">
          <h2 className="mb-4 text-lg font-semibold text-(--foreground)">
            Akses Cepat
          </h2>
          <p className="text-sm text-(--muted-foreground)">
            Dashboard ini akan menampilkan ringkasan data HRIS. Gunakan menu di
            sidebar untuk mengakses fitur-fitur yang tersedia.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
