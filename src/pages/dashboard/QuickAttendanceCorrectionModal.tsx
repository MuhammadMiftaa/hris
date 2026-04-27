import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button, Input } from "@/components/ui/FormElements";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { useOverrideMutations } from "@/hooks/useAttendance";
import { OVERRIDE_TYPE_OPTIONS, type OverrideType } from "@/types/attendance-override";
import { useDashboardMetadata } from "@/hooks/useDashboard";
import { Modal } from "@/components/ui/Modal";

export function QuickAttendanceCorrectionModal({ onClose }: { onClose: () => void }) {
  const { data: metadata } = useDashboardMetadata();
  const recentAttendances = metadata?.recent_attendance_meta || [];
  const { createOverride, loading } = useOverrideMutations();

  const [formData, setFormData] = useState({
    attendance_log_id: "",
    override_type: "clock_in" as OverrideType,
    corrected_clock_in: "",
    corrected_clock_out: "",
    reason: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.attendance_log_id)
      newErrors.attendance_log_id = "Log presensi wajib dipilih";
    if (!formData.reason.trim()) newErrors.reason = "Alasan wajib diisi";
    
    if (formData.override_type === "clock_in" || formData.override_type === "full_day") {
      if (!formData.corrected_clock_in) newErrors.corrected_clock_in = "Jam masuk wajib diisi";
    }
    if (formData.override_type === "clock_out" || formData.override_type === "full_day") {
      if (!formData.corrected_clock_out) newErrors.corrected_clock_out = "Jam pulang wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const result = await createOverride({
      attendance_log_id: parseInt(formData.attendance_log_id),
      override_type: formData.override_type,
      corrected_clock_in: formData.corrected_clock_in || null,
      corrected_clock_out: formData.corrected_clock_out || null,
      reason: formData.reason.trim(),
    });
    
    if (result) onClose();
  };

  return (
    <Modal open title="Koreksi Presensi" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <SearchableSelect
          label="Pilih Log Presensi *"
          value={formData.attendance_log_id}
          onChange={(val) =>
            setFormData((p) => ({ ...p, attendance_log_id: val }))
          }
          options={recentAttendances.map((a) => ({
            value: String(a.id),
            label: a.name,
          }))}
          placeholder="Pilih log presensi..."
        />
        {errors.attendance_log_id && (
          <p className="text-xs text-(--destructive)">{errors.attendance_log_id}</p>
        )}

        <SearchableSelect
          label="Tipe Koreksi *"
          value={formData.override_type}
          onChange={(val) =>
            setFormData((p) => ({ ...p, override_type: val as OverrideType }))
          }
          options={OVERRIDE_TYPE_OPTIONS}
          placeholder="Pilih tipe koreksi..."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(formData.override_type === "clock_in" || formData.override_type === "full_day") && (
            <Input
              id="corrected_clock_in"
              label="Jam Masuk Benar *"
              type="datetime-local"
              value={formData.corrected_clock_in}
              onChange={(e) =>
                setFormData((p) => ({ ...p, corrected_clock_in: e.target.value }))
              }
              error={errors.corrected_clock_in}
            />
          )}
          {(formData.override_type === "clock_out" || formData.override_type === "full_day") && (
            <Input
              id="corrected_clock_out"
              label="Jam Pulang Benar *"
              type="datetime-local"
              value={formData.corrected_clock_out}
              onChange={(e) =>
                setFormData((p) => ({ ...p, corrected_clock_out: e.target.value }))
              }
              error={errors.corrected_clock_out}
            />
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-(--foreground) opacity-80">
            Alasan Koreksi *
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) =>
              setFormData((p) => ({ ...p, reason: e.target.value }))
            }
            placeholder="Jelaskan alasan koreksi (misal: Lupa absen pagi)..."
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
            Ajukan Koreksi
          </Button>
        </div>
      </form>
    </Modal>
  );
}
