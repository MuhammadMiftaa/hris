import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button, Input } from "@/components/ui/FormElements";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { usePermissionRequestMutations } from "@/hooks/usePermissionRequest";
import { PERMISSION_TYPE_OPTIONS, type PermissionType } from "@/types/permission-request";
import { useAuth } from "@/contexts/AuthContext";
import { useEmployeeList } from "@/hooks/useEmployee";
import { Modal } from "@/components/ui/Modal";

export function QuickPermissionModal({ onClose }: { onClose: () => void }) {
  const { createRequest, loading } = usePermissionRequestMutations();
  const { user } = useAuth();
  const isAdmin = user?.role_level === "admin" || user?.role_level === "superadmin";
  const { data: employees } = useEmployeeList({ is_active: true });

  const [formData, setFormData] = useState({
    employee_id: "",
    permission_type: "out_of_office" as PermissionType,
    date: "",
    leave_time: "",
    return_time: "",
    reason: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.date) newErrors.date = "Tanggal wajib diisi";
    if (!formData.reason.trim()) newErrors.reason = "Alasan wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await createRequest({
      employee_id: isAdmin && formData.employee_id ? parseInt(formData.employee_id) : undefined,
      permission_type: formData.permission_type,
      date: formData.date,
      leave_time: formData.leave_time || null,
      return_time: formData.return_time || null,
      reason: formData.reason.trim(),
    });
    if (result) onClose();
  };

  return (
    <Modal open title="Ajukan Izin" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isAdmin && (
          <SearchableSelect
            label="Pegawai (Pilih jika mengajukan untuk staf)"
            value={formData.employee_id}
            onChange={(val) => setFormData((p) => ({ ...p, employee_id: val }))}
            options={[
              { value: "", label: "-- Pengajuan Diri Sendiri --" },
              ...(employees?.map((e) => ({
                value: String(e.id),
                label: e.full_name,
              })) || []),
            ]}
            placeholder="Cari pegawai..."
          />
        )}

        <SearchableSelect
          label="Tipe Izin"
          value={formData.permission_type}
          onChange={(val) =>
            setFormData((p) => ({ ...p, permission_type: val as PermissionType }))
          }
          options={PERMISSION_TYPE_OPTIONS}
          placeholder="Pilih tipe izin..."
        />
        <Input
          id="date"
          label="Tanggal"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData((p) => ({ ...p, date: e.target.value }))}
          error={errors.date}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="leave_time"
            label={
              formData.permission_type === "late_arrival"
                ? "Jam Tiba (perkiraan)"
                : "Jam Keluar"
            }
            type="time"
            value={formData.leave_time}
            onChange={(e) =>
              setFormData((p) => ({ ...p, leave_time: e.target.value }))
            }
          />
          {formData.permission_type === "out_of_office" && (
            <Input
              id="return_time"
              label="Jam Kembali"
              type="time"
              value={formData.return_time}
              onChange={(e) =>
                setFormData((p) => ({ ...p, return_time: e.target.value }))
              }
            />
          )}
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-(--foreground) opacity-80">
            Alasan *
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) =>
              setFormData((p) => ({ ...p, reason: e.target.value }))
            }
            placeholder="Jelaskan alasan pengajuan izin..."
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
            Ajukan Izin
          </Button>
        </div>
      </form>
    </Modal>
  );
}
