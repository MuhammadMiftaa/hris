import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Network,
  Briefcase,
  Building2,
  IdCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MainLayout } from "@/components/layout/MainLayout";
import {
  useEmployeeProfile,
  useEmployeeProfileContacts,
} from "@/hooks/useEmployeeProfile";
import {
  GENDER_LABELS,
  MARITAL_STATUS_LABELS,
  CONTACT_TYPE_LABELS,
} from "@/types/employee";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

// ════════════════════════════════════════════
// TAB NAV
// ════════════════════════════════════════════

function TabNav({
  activeTab,
  setActiveTab,
}: {
  activeTab: number;
  setActiveTab: (tab: number) => void;
}) {
  const tabs = [
    { label: "Info Pribadi", icon: User },
    { label: "Data Pekerjaan", icon: Briefcase },
    { label: "Kontak", icon: Phone },
  ];

  return (
    <div className="flex gap-1 overflow-x-auto border-b border-(--border)">
      {tabs.map((tab, index) => (
        <button
          key={tab.label}
          onClick={() => setActiveTab(index)}
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap",
            activeTab === index
              ? "border-(--primary) text-(--primary)"
              : "border-transparent text-(--muted-foreground) hover:text-(--foreground)",
          )}
        >
          <tab.icon size={16} />
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════
// INFO ITEM
// ════════════════════════════════════════════

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-(--muted-foreground)">{label}</div>
      <div className="text-sm font-medium text-(--foreground)">
        {value || "-"}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════

export function ProfilePage() {
  const navigate = useNavigate();
  const { data: profile, loading: profileLoading } = useEmployeeProfile();
  const { data: contacts, loading: contactsLoading } =
    useEmployeeProfileContacts();

  const [activeTab, setActiveTab] = useState(0);

  const loading = profileLoading || contactsLoading;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "??";

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col gap-6 p-4 pt-16 md:p-6 md:pt-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </MainLayout>
    );
  }

  if (!profile) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center p-6 pt-16 min-h-[50vh] md:pt-6">
          <EmptyState
            title="Profil tidak ditemukan"
            description="Data profil Anda tidak tersedia saat ini"
            icon={<User className="h-12 w-12" />}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 p-4 pt-16 md:p-6 md:pt-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="rounded-lg p-2 text-(--muted-foreground) transition hover:bg-(--muted) hover:text-(--foreground)"
            >
              <ArrowLeft size={20} />
            </button>
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white"
              style={{
                background:
                  "linear-gradient(135deg, #9d167c 0%, #d10071 60%, #dd0d89 100%)",
              }}
            >
              {profile.photo_url ? (
                <img
                  src={profile.photo_url}
                  alt="Profile"
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-(--foreground)">
                {profile.full_name}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <p className="text-sm text-(--muted-foreground)">
                  {profile.employee_number}
                  {profile.job_position_title
                    ? ` · ${profile.job_position_title}`
                    : ""}
                </p>
                {profile.department_name && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-(--border) bg-(--secondary)/50 px-2 py-0.5 text-xs font-medium text-(--muted-foreground)">
                    <Network size={10} />
                    {profile.department_name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        <div className="min-h-75">
          {/* Tab: Info Pribadi */}
          {activeTab === 0 && (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Data Dasar */}
              <div className="rounded-xl border border-(--border) bg-(--card) p-5">
                <div className="flex items-center gap-2 mb-4">
                  <IdCard size={18} className="text-(--primary)" />
                  <h3 className="font-semibold text-(--foreground)">
                    Data Dasar
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem
                    label="Nomor Pegawai"
                    value={profile.employee_number}
                  />
                  <InfoItem label="Nama Lengkap" value={profile.full_name} />
                  <InfoItem
                    label="Tanggal Lahir"
                    value={formatDate(profile.birth_date)}
                  />
                  <InfoItem label="Tempat Lahir" value={profile.birth_place} />
                  <InfoItem
                    label="Jenis Kelamin"
                    value={
                      profile.gender ? GENDER_LABELS[profile.gender] : undefined
                    }
                  />
                  <InfoItem label="Agama" value={profile.religion} />
                </div>
              </div>

              {/* Data Kependudukan */}
              <div className="rounded-xl border border-(--border) bg-(--card) p-5">
                <div className="flex items-center gap-2 mb-4">
                  <User size={18} className="text-(--primary)" />
                  <h3 className="font-semibold text-(--foreground)">
                    Data Kependudukan
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem label="NIK" value={profile.nik} />
                  <InfoItem label="NPWP" value={profile.npwp} />
                  <InfoItem label="Nomor KK" value={profile.kk_number} />
                  <InfoItem
                    label="Status Pernikahan"
                    value={
                      profile.marital_status
                        ? MARITAL_STATUS_LABELS[profile.marital_status]
                        : undefined
                    }
                  />
                  <InfoItem label="Golongan Darah" value={profile.blood_type} />
                  <InfoItem
                    label="Kewarganegaraan"
                    value={profile.nationality}
                  />
                  <InfoItem
                    label="Tinggi/Berat Badan"
                    value={
                      profile.height || profile.weight
                        ? `${profile.height || "-"} cm / ${profile.weight || "-"} kg`
                        : undefined
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab: Data Pekerjaan */}
          {activeTab === 1 && (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Penempatan */}
              <div className="rounded-xl border border-(--border) bg-(--card) p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Building2 size={18} className="text-(--primary)" />
                  <h3 className="font-semibold text-(--foreground)">
                    Penempatan
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoItem label="Cabang" value={profile.branch_name} />
                  <InfoItem
                    label="Departemen"
                    value={profile.department_name}
                  />
                </div>
              </div>

              {/* Jabatan */}
              <div className="rounded-xl border border-(--border) bg-(--card) p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase size={18} className="text-(--primary)" />
                  <h3 className="font-semibold text-(--foreground)">
                    Jabatan & Role
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoItem
                    label="Jabatan"
                    value={profile.job_position_title}
                  />
                  <InfoItem label="Role" value={profile.role_name} />
                </div>
              </div>

              {/* Info Tambahan */}
              <div className="rounded-xl border border-(--border) bg-(--card) p-5 lg:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <IdCard size={18} className="text-(--primary)" />
                  <h3 className="font-semibold text-(--foreground)">
                    Informasi Tambahan
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <InfoItem
                    label="Bergabung Sejak"
                    value={formatDate(profile.created_at)}
                  />
                  <InfoItem
                    label="Terakhir Diperbarui"
                    value={formatDate(profile.updated_at)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab: Kontak */}
          {activeTab === 2 && (
            <div className="space-y-4">
              {!contacts || contacts.length === 0 ? (
                <EmptyState
                  title="Belum ada data kontak"
                  description="Data kontak Anda belum tersedia"
                  icon={<Phone className="h-10 w-10" />}
                />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-start gap-3 rounded-xl border border-(--border) bg-(--card) p-4"
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                          contact.contact_type === "phone" &&
                            "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
                          contact.contact_type === "email" &&
                            "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
                          contact.contact_type === "address" &&
                            "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
                        )}
                      >
                        {contact.contact_type === "phone" && (
                          <Phone size={18} />
                        )}
                        {contact.contact_type === "email" && <Mail size={18} />}
                        {contact.contact_type === "address" && (
                          <MapPin size={18} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-(--muted-foreground)">
                            {CONTACT_TYPE_LABELS[contact.contact_type]}
                            {contact.contact_label &&
                              ` · ${contact.contact_label}`}
                          </span>
                          {contact.is_primary && (
                            <span className="rounded-full bg-(--primary)/10 px-2 py-0.5 text-xs font-medium text-(--primary)">
                              Utama
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-sm font-medium text-(--foreground) break-all">
                          {contact.contact_value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
