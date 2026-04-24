import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button, Input } from "@/components/ui/FormElements";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { useOvertimeMutations } from "@/hooks/useOvertime";
import { WORK_LOCATION_OPTIONS, type CreateOvertimePayload } from "@/types/overtime";
import { useDashboardMetadata } from "@/hooks/useDashboard";
import { formatDateLong } from "@/utils/date";
import { Modal } from "@/components/ui/Modal";

export function QuickOvertimeModal({ onClose }: { onClose: () => void }) {
  const { data: metadata } = useDashboardMetadata();
  const recentAttendances = metadata?.recent_attendance_meta || [];
  
  const { createOvertime, loading } = useOvertimeMutations();

  const [formData, setFormData] = useState({
    attendance_log_id: "",
    overtime_date: "",
    planned_start: "",
    planned_end: "",
    planned_minutes: "",
    reason: "",
    work_location_type: "office" as CreateOvertimePayload["work_location_type"],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculatedMinutes = useMemo(() => {
    if (!formData.planned_start || !formData.planned_end) return 0;
    const today =
      formData.overtime_date || new Date().toISOString().split("T")[0];
    const start = new Date(`${today}T${formData.planned_start}`);
    const end = new Date(`${today}T${formData.planned_end}`);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60);
    return diff > 0 ? diff : 0;
  }, [formData.planned_start, formData.planned_end, formData.overtime_date]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.attendance_log_id)
      newErrors.attendance_log_id = "Log presensi wajib dipilih";
    if (!formData.overtime_date)
      newErrors.overtime_date = "Tanggal wajib diisi";
    if (!formData.reason.trim()) newErrors.reason = "Alasan wajib diisi";
    if (calculatedMinutes <= 0 && !formData.planned_minutes)
      newErrors.planned_minutes = "Durasi lembur wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAttendanceChange = (logId: string) => {
    const log = recentAttendances.find((a) => String(a.id) === logId);
    setFormData((p) => ({
      ...p,
      attendance_log_id: logId,
      // Backend returns attendance_date as Meta.name, e.g. "2026-04-24"
      overtime_date: log ? log.name : p.overtime_date,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const minutes =
      calculatedMinutes > 0
        ? calculatedMinutes
        : parseInt(formData.planned_minutes) || 0;
    
    const result = await createOvertime({
      attendance_log_id: parseInt(formData.attendance_log_id),
      overtime_date: formData.overtime_date,
      planned_start: formData.planned_start
        ? `${formData.overtime_date}T${formData.planned_start}:00Z`
        : undefined,
      planned_end: formData.planned_end
        ? `${formData.overtime_date}T${formData.planned_end}:00Z`
        : undefined,
      planned_minutes: minutes,
      reason: formData.reason.trim(),
      work_location_type: formData.work_location_type,
    });
    
    if (result) onClose();
  };

  return (
    <Modal open title="Ajukan Lembur" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <SearchableSelect
          label="Pilih Log Presensi *"
          value={formData.attendance_log_id}
          onChange={handleAttendanceChange}
          options={recentAttendances.map((a) => ({
            value: String(a.id),
            label: `${formatDateLong(a.name)} (Hadir)`,
          }))}
          placeholder="Pilih log presensi..."
        />
        {errors.attendance_log_id && (
          <p className="text-xs text-(--destructive)">{errors.attendance_log_id}</p>
        )}

        {/* Removed redundant overtime_date input since it is populated by attendance select */}

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="planned_start"
            label="Jam Mulai (rencana)"
            type="time"
            value={formData.planned_start}
            onChange={(e) =>
              setFormData((p) => ({ ...p, planned_start: e.target.value }))
            }
          />
          <Input
            id="planned_end"
            label="Jam Selesai (rencana)"
            type="time"
            value={formData.planned_end}
            onChange={(e) =>
              setFormData((p) => ({ ...p, planned_end: e.target.value }))
            }
          />
        </div>
        
        {calculatedMinutes > 0 ? (
          <p className="text-sm text-(--muted-foreground)">
            Durasi:{" "}
            <strong className="text-(--foreground)">
              {Math.floor(calculatedMinutes / 60)} jam{" "}
              {calculatedMinutes % 60 > 0 ? `${calculatedMinutes % 60} mnt` : ""}
            </strong>
          </p>
        ) : (
          <Input
            id="planned_minutes"
            label="Durasi (menit) *"
            type="number"
            min="1"
            value={formData.planned_minutes}
            onChange={(e) =>
              setFormData((p) => ({ ...p, planned_minutes: e.target.value }))
            }
            placeholder="Contoh: 120"
            error={errors.planned_minutes}
          />
        )}

        <SearchableSelect
          label="Lokasi Kerja"
          value={formData.work_location_type}
          onChange={(val) =>
            setFormData((p) => ({
              ...p,
              work_location_type:
                val as CreateOvertimePayload["work_location_type"],
            }))
          }
          options={WORK_LOCATION_OPTIONS}
          placeholder="Pilih lokasi..."
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-(--foreground) opacity-80">
            Alasan Lembur *
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) =>
              setFormData((p) => ({ ...p, reason: e.target.value }))
            }
            placeholder="Jelaskan alasan dan tugas lembur..."
            rows={3}
            className={cn(
              "w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground)",
              "border-(--border) placeholder:text-(--muted-foreground) transition-colors duration-200",
              "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring) resize-none",
              errors.reason && "border-(--destructive)",
            )}
          />
          {errors.reason && (
            <p className="text-xs text-(--destructive)">{errors.reason}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-(--border)">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            Ajukan Lembur
          </Button>
        </div>
      </form>
    </Modal>
  );
}
