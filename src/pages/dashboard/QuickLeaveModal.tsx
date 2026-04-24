import { useState, useMemo } from "react";
import { Button, Input } from "@/components/ui/FormElements";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { useLeaveRequestMutations } from "@/hooks/useLeave";
import { useDashboardMetadata } from "@/hooks/useDashboard";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

export function QuickLeaveModal({ onClose }: { onClose: () => void }) {
  const { data: metadata } = useDashboardMetadata();
  const leaveTypes = metadata?.leave_type_meta;
  const { createRequest, loading } = useLeaveRequestMutations();
  
  const [formData, setFormData] = useState({
    leave_type_id: "",
    start_date: "",
    end_date: "",
    reason: "",
    document_url: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

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
    if (!formData.leave_type_id)
      newErrors.leave_type_id = "Jenis cuti wajib dipilih";
    if (!formData.start_date)
      newErrors.start_date = "Tanggal mulai wajib diisi";
    if (!formData.end_date) newErrors.end_date = "Tanggal selesai wajib diisi";
    if (
      formData.start_date &&
      formData.end_date &&
      new Date(formData.end_date) < new Date(formData.start_date)
    ) {
      newErrors.end_date = "Tanggal selesai tidak boleh sebelum tanggal mulai";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await createRequest({
      leave_type_id: parseInt(formData.leave_type_id),
      start_date: formData.start_date,
      end_date: formData.end_date,
      total_days: totalDays,
      reason: formData.reason.trim() || undefined,
      document_url: formData.document_url.trim() || undefined,
    });
    if (result) onClose();
  };

  return (
    <Modal open title="Ajukan Cuti" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <SearchableSelect
            label="Jenis Cuti"
            value={formData.leave_type_id}
            onChange={(val) => handleChange("leave_type_id", val)}
            options={
              leaveTypes?.map((lt) => ({
                value: String(lt.id),
                label: lt.name,
              })) || []
            }
            placeholder="Pilih jenis cuti..."
            searchPlaceholder="Cari jenis cuti..."
          />
          {errors.leave_type_id && (
            <p className="text-xs text-(--destructive)">{errors.leave_type_id}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="start_date"
            label="Tanggal Mulai"
            type="date"
            value={formData.start_date}
            onChange={(e) => handleChange("start_date", e.target.value)}
            error={errors.start_date}
          />
          <Input
            id="end_date"
            label="Tanggal Selesai"
            type="date"
            value={formData.end_date}
            onChange={(e) => handleChange("end_date", e.target.value)}
            error={errors.end_date}
          />
        </div>

        {totalDays > 0 && (
          <p className="text-sm text-(--muted-foreground)">
            Total: <strong className="text-(--foreground)">{totalDays} hari</strong>
          </p>
        )}

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-(--foreground) opacity-80">
            Alasan
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) => handleChange("reason", e.target.value)}
            placeholder="Alasan pengajuan cuti (opsional)"
            rows={3}
            className={cn(
              "w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground)",
              "border-(--border) placeholder:text-(--muted-foreground) transition-colors duration-200",
              "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring) resize-none",
            )}
          />
        </div>

        <Input
          id="document_url"
          label="URL Dokumen Pendukung"
          value={formData.document_url}
          onChange={(e) => handleChange("document_url", e.target.value)}
          placeholder="https://..."
          error={errors.document_url}
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
            Ajukan Cuti
          </Button>
        </div>
      </form>
    </Modal>
  );
}
