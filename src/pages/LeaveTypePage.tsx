import { useState } from "react";
import { Plus, Edit2, Trash2, CalendarOff, X } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useLeaveTypeList, useLeaveTypeMutations } from "@/hooks/useLeaveType";
import {
  LeaveType,
  LeaveCategory,
  LEAVE_CATEGORY_OPTIONS,
  CreateLeaveTypePayload,
} from "@/types/leave";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input, Button } from "@/components/ui/FormElements";
import { cn } from "@/lib/utils";

// ════════════════════════════════════════════
// TOGGLE SWITCH
// ════════════════════════════════════════════

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          checked ? "bg-(--primary)" : "bg-(--muted)",
        )}
        onClick={() => onChange(!checked)}
      >
        <div
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </div>
      {label && <span className="text-sm text-(--foreground)">{label}</span>}
    </label>
  );
}

export function LeaveTypePage() {
  const { data: leaveTypes, loading, refetch } = useLeaveTypeList();
  const { createLeaveType, updateLeaveType, deleteLeaveType } =
    useLeaveTypeMutations(() => {
      setIsModalOpen(false);
      refetch();
    });

  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeaveType, setEditingLeaveType] = useState<LeaveType | null>(
    null,
  );

  // Form State
  const [formData, setFormData] = useState<CreateLeaveTypePayload>({
    name: "",
    category: "annual",
    requires_document: false,
    requires_document_type: "",
    max_duration_per_request: null,
    max_duration_unit: "days",
    max_occurrences_per_year: null,
    max_total_duration_per_year: null,
    max_total_duration_unit: "days",
  });

  const handleOpenModal = (leaveType?: LeaveType) => {
    if (leaveType) {
      setEditingLeaveType(leaveType);
      setFormData({
        name: leaveType.name,
        category: leaveType.category,
        requires_document: leaveType.requires_document,
        requires_document_type: leaveType.requires_document_type || "",
        max_duration_per_request: leaveType.max_duration_per_request,
        max_duration_unit: leaveType.max_duration_unit || "days",
        max_occurrences_per_year: leaveType.max_occurrences_per_year,
        max_total_duration_per_year: leaveType.max_total_duration_per_year,
        max_total_duration_unit: leaveType.max_total_duration_unit || "days",
      });
    } else {
      setEditingLeaveType(null);
      setFormData({
        name: "",
        category: "annual",
        requires_document: false,
        requires_document_type: "",
        max_duration_per_request: null,
        max_duration_unit: "days",
        max_occurrences_per_year: null,
        max_total_duration_per_year: null,
        max_total_duration_unit: "days",
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus jenis cuti ini?")) {
      await deleteLeaveType(id);
      refetch();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLeaveType) {
      await updateLeaveType(editingLeaveType.id, formData);
    } else {
      await createLeaveType(formData);
    }
  };

  const getCategoryLabel = (cat: LeaveCategory) => {
    const opt = LEAVE_CATEGORY_OPTIONS.find((o) => o.value === cat);
    return opt ? opt.label : cat;
  };

  const filteredLeaveTypes =
    leaveTypes?.filter(
      (lt) => filterCategory === "all" || lt.category === filterCategory,
    ) || [];

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-(--foreground)">
              Jenis Cuti
            </h1>
            <p className="text-sm text-(--muted-foreground)">
              Kelola master data jenis cuti dan peraturannya.
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-(--primary) px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-(--primary)/90"
          >
            <Plus size={16} /> Tambah Jenis Cuti
          </button>
        </div>

        <div className="rounded-xl border border-(--border) bg-(--card) shadow-sm">
          <div className="flex items-center border-b border-(--border) p-4">
            <div className="w-48">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full rounded-md border border-(--border) px-3 py-1.5 text-sm"
              >
                <option value="all">Semua Kategori</option>
                {LEAVE_CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="p-4 space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : filteredLeaveTypes.length === 0 ? (
            <div className="p-8">
              <EmptyState
                title="Tidak ada data"
                description="Belum ada data jenis cuti."
                icon={<CalendarOff className="h-12 w-12" />}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-(--border) bg-(--muted)/50">
                    <th className="px-4 py-3 font-medium text-(--muted-foreground)">
                      Nama
                    </th>
                    <th className="px-4 py-3 font-medium text-(--muted-foreground)">
                      Kategori
                    </th>
                    <th className="px-4 py-3 font-medium text-(--muted-foreground)">
                      Maks/Request
                    </th>
                    <th className="px-4 py-3 font-medium text-(--muted-foreground)">
                      Maks/Tahun
                    </th>
                    <th className="px-4 py-3 font-medium text-(--muted-foreground)">
                      Wajib Dokumen
                    </th>
                    <th className="px-4 py-3 font-medium text-(--muted-foreground) text-right">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-(--border)">
                  {filteredLeaveTypes.map((lt) => (
                    <tr key={lt.id} className="hover:bg-(--muted)/30">
                      <td className="px-4 py-3 font-medium">{lt.name}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800">
                          {getCategoryLabel(lt.category)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {lt.max_duration_per_request
                          ? `${lt.max_duration_per_request} ${lt.max_duration_unit === "days" ? "Hari" : "Jam"}`
                          : "-"}
                      </td>
                      <td className="px-4 py-3">
                        {lt.max_total_duration_per_year
                          ? `${lt.max_total_duration_per_year} ${lt.max_total_duration_unit === "days" ? "Hari" : "Jam"}`
                          : "-"}
                        {lt.max_occurrences_per_year &&
                          ` (${lt.max_occurrences_per_year}x)`}
                      </td>
                      <td className="px-4 py-3">
                        {lt.requires_document ? (
                          <span className="text-amber-600 font-medium">
                            Ya ({lt.requires_document_type})
                          </span>
                        ) : (
                          "Tidak"
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleOpenModal(lt)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(lt.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded ml-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-(--card) shadow-lg flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between border-b border-(--border) p-5">
                <h3 className="text-lg font-bold">
                  {editingLeaveType ? "Edit Jenis Cuti" : "Tambah Jenis Cuti"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-2 text-(--muted-foreground) hover:bg-(--muted)"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 overflow-y-auto">
                <form
                  id="leave-type-form"
                  onSubmit={handleSave}
                  className="space-y-4"
                >
                  <Input
                    id="name"
                    label="Nama Jenis Cuti"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    placeholder="Contoh: Cuti Melahirkan"
                  />

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-(--foreground) opacity-80">
                      Kategori
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as LeaveCategory,
                        })
                      }
                      className={cn(
                        "w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground)",
                        "border-(--border) placeholder:text-(--muted-foreground)",
                        "transition-colors duration-200",
                        "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring)",
                      )}
                    >
                      {LEAVE_CATEGORY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      id="max_duration_per_request"
                      label="Maks Durasi / Request"
                      type="number"
                      value={formData.max_duration_per_request || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          max_duration_per_request: e.target.value
                            ? Number(e.target.value)
                            : null,
                        })
                      }
                    />
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-(--foreground) opacity-80">
                        Satuan
                      </label>
                      <select
                        value={formData.max_duration_unit || "days"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            max_duration_unit: e.target.value as any,
                          })
                        }
                        className={cn(
                          "w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground)",
                          "border-(--border) placeholder:text-(--muted-foreground)",
                          "transition-colors duration-200",
                          "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring)",
                        )}
                      >
                        <option value="days">Hari</option>
                        <option value="hours">Jam</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      id="max_occurrences_per_year"
                      label="Maks Frekuensi / Tahun"
                      type="number"
                      value={formData.max_occurrences_per_year || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          max_occurrences_per_year: e.target.value
                            ? Number(e.target.value)
                            : null,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      id="max_total_duration_per_year"
                      label="Maks Total Durasi / Tahun"
                      type="number"
                      value={formData.max_total_duration_per_year || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          max_total_duration_per_year: e.target.value
                            ? Number(e.target.value)
                            : null,
                        })
                      }
                    />
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-(--foreground) opacity-80">
                        Satuan
                      </label>
                      <select
                        value={formData.max_total_duration_unit || "days"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            max_total_duration_unit: e.target.value as any,
                          })
                        }
                        className={cn(
                          "w-full rounded-lg border bg-(--input) px-4 py-2.5 text-sm text-(--foreground)",
                          "border-(--border) placeholder:text-(--muted-foreground)",
                          "transition-colors duration-200",
                          "focus:border-(--ring) focus:outline-none focus:ring-1 focus:ring-(--ring)",
                        )}
                      >
                        <option value="days">Hari</option>
                        <option value="hours">Jam</option>
                      </select>
                    </div>
                  </div>

                  <Toggle
                    label="Wajib Lampirkan Dokumen"
                    checked={formData.requires_document}
                    onChange={(checked) =>
                      setFormData({ ...formData, requires_document: checked })
                    }
                  />

                  {formData.requires_document && (
                    <Input
                      id="requires_document_type"
                      label="Jenis Dokumen yang Dibutuhkan"
                      value={formData.requires_document_type || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requires_document_type: e.target.value,
                        })
                      }
                      required
                      placeholder="Contoh: Surat Dokter, FC Kartu Keluarga"
                    />
                  )}
                </form>
              </div>

              <div className="border-t border-(--border) p-5 flex justify-end gap-3 mt-auto">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit" variant="primary" form="leave-type-form">
                  Simpan
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
