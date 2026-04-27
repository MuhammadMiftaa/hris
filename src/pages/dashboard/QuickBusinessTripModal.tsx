import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button, Input } from "@/components/ui/FormElements";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { useBusinessTripMutations } from "@/hooks/useBusinessTrip";
import { useAuth } from "@/contexts/AuthContext";
import { useEmployeeList } from "@/hooks/useEmployee";
import { Modal } from "@/components/ui/Modal";
import { DocumentUploader } from "@/components/ui/DocumentUploader";

export function QuickBusinessTripModal({ onClose }: { onClose: () => void }) {
  const { createTrip, loading } = useBusinessTripMutations();
  const { user } = useAuth();
  const isAdmin = user?.role_level === "admin" || user?.role_level === "superadmin";
  const { data: employees } = useEmployeeList({ is_active: true });

  const [formData, setFormData] = useState({
    employee_id: "",
    destination: "",
    start_date: "",
    end_date: "",
    purpose: "",
    document_url: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalDays = useMemo(() => {
    if (!formData.start_date || !formData.end_date) return 0;
    const diff = Math.ceil(
      (new Date(formData.end_date).getTime() -
        new Date(formData.start_date).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return diff >= 0 ? diff + 1 : 0;
  }, [formData.start_date, formData.end_date]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.destination.trim())
      newErrors.destination = "Tujuan wajib diisi";
    if (!formData.start_date)
      newErrors.start_date = "Tanggal mulai wajib diisi";
    if (!formData.end_date) newErrors.end_date = "Tanggal selesai wajib diisi";
    if (!formData.purpose.trim())
      newErrors.purpose = "Tujuan perjalanan wajib diisi";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await createTrip({
      employee_id: isAdmin && formData.employee_id ? parseInt(formData.employee_id) : undefined,
      destination: formData.destination.trim(),
      start_date: formData.start_date,
      end_date: formData.end_date,
      total_days: totalDays,
      purpose: formData.purpose.trim(),
      document_url: formData.document_url.trim() || undefined,
    });
    if (result) onClose();
  };

  return (
    <Modal open title="Ajukan Tugas" onClose={onClose}>
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

        <Input
          id="destination"
          label="Tujuan Kota/Daerah *"
          value={formData.destination}
          onChange={(e) =>
            setFormData((p) => ({ ...p, destination: e.target.value }))
          }
          placeholder="Contoh: Jakarta, Bandung"
          error={errors.destination}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="start_date"
            label="Tanggal Mulai *"
            type="date"
            value={formData.start_date}
            onChange={(e) =>
              setFormData((p) => ({ ...p, start_date: e.target.value }))
            }
            error={errors.start_date}
          />
          <Input
            id="end_date"
            label="Tanggal Selesai *"
            type="date"
            value={formData.end_date}
            onChange={(e) =>
              setFormData((p) => ({ ...p, end_date: e.target.value }))
            }
            error={errors.end_date}
          />
        </div>
        {totalDays > 0 && (
          <p className="text-sm text-(--muted-foreground)">
            Total:{" "}
            <strong className="text-(--foreground)">{totalDays} hari</strong>
          </p>
        )}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-(--foreground) opacity-80">
            Tujuan Perjalanan *
          </label>
          <textarea
            value={formData.purpose}
            onChange={(e) =>
              setFormData((p) => ({ ...p, purpose: e.target.value }))
            }
            placeholder="Jelaskan tujuan dan agenda perjalanan dinas..."
            rows={3}
            className={cn(
              "w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground)",
              "border-(--border) placeholder:text-(--muted-foreground) transition-colors duration-200",
              "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring) resize-none",
              errors.purpose && "border-(--destructive)",
            )}
          />
          {errors.purpose && (
            <p className="text-xs text-(--destructive)">{errors.purpose}</p>
          )}
        </div>
        <DocumentUploader
          value={formData.document_url}
          onChange={(key) =>
            setFormData((p) => ({ ...p, document_url: key }))
          }
          documentType="business_trip"
          label="Surat Tugas (opsional)"
        />
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
            Ajukan Tugas
          </Button>
        </div>
      </form>
    </Modal>
  );
}
