import { useState } from "react";
import {
  CalendarDays,
  Clock,
  Plane,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { QuickLeaveModal } from "./QuickLeaveModal";
import { QuickPermissionModal } from "./QuickPermissionModal";
import { QuickBusinessTripModal } from "./QuickBusinessTripModal";
import { QuickOvertimeModal } from "./QuickOvertimeModal";
import { PermissionGate } from "@/components/ui/PermissionGate";
import { PERMISSIONS } from "@/constants/permission";

export function QuickRequestSection() {
  const [activeModal, setActiveModal] = useState<
    "leave" | "permission" | "trip" | "overtime" | null
  >(null);

  const cards = [
    {
      key: "leave" as const,
      icon: CalendarDays,
      iconBg: "bg-[#fbeaf0] dark:bg-[#d4537e]/20",
      iconColor: "text-[#d4537e] dark:text-[#fbeaf0]",
      label: "Cuti",
      sublabel: "Tahunan, sakit, khusus",
      permission: PERMISSIONS.LEAVE_CREATE,
    },
    {
      key: "permission" as const,
      icon: Clock,
      iconBg: "bg-[#faeeda] dark:bg-[#ba7517]/20",
      iconColor: "text-[#ba7517] dark:text-[#faeeda]",
      label: "Izin",
      sublabel: "Izin terlambat/keluar",
      permission: PERMISSIONS.REQUEST_CREATE,
    },
    {
      key: "trip" as const,
      icon: Plane,
      iconBg: "bg-[#e6f1fb] dark:bg-[#185fa5]/20",
      iconColor: "text-[#185fa5] dark:text-[#e6f1fb]",
      label: "Dinas Luar",
      sublabel: "Perjalanan dinas",
      permission: PERMISSIONS.REQUEST_CREATE,
    },
    {
      key: "overtime" as const,
      icon: ClipboardList,
      iconBg: "bg-[#eaf3de] dark:bg-[#3b6d11]/20",
      iconColor: "text-[#3b6d11] dark:text-[#eaf3de]",
      label: "Lembur",
      sublabel: "Overtime kerja",
      permission: PERMISSIONS.REQUEST_CREATE,
    },
  ];

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-(--foreground)">
        Pengajuan Cepat
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {cards.map((card) => (
          <PermissionGate key={card.key} permission={card.permission}>
            <button
              onClick={() => setActiveModal(card.key)}
              className="flex items-center gap-3 rounded-xl border border-(--border) bg-(--card) p-3 text-left transition hover:border-(--primary)/40"
            >
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", card.iconBg)}>
                <card.icon size={18} className={card.iconColor} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-(--foreground) truncate">{card.label}</p>
                <p className="text-[10px] text-(--muted-foreground) truncate">{card.sublabel}</p>
              </div>
            </button>
          </PermissionGate>
        ))}
      </div>

      {activeModal === "leave" && (
        <QuickLeaveModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "permission" && (
        <QuickPermissionModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "trip" && (
        <QuickBusinessTripModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "overtime" && (
        <QuickOvertimeModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}
